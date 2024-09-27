import { useNavigate } from "react-router-dom";
import { useApp } from "../../state/AppProvider";
import { Bars } from "../../components/charts/Bars";
import { PageFade } from "../../components/layout/PageFade";
import { AnimatedNumber } from "../../components/dashboard/AnimatedNumber";
import { admissions7, wards } from "../../data/dashboard";
import { formatCurrency } from "../../utils/currency";
import { formatDateTime } from "../../utils/dates";
import { useI18n } from "../../i18n/I18nProvider";
import "./Overview.css";

// Manchester Triage levels, most urgent first. The board borrows them so a colour means the
// same urgency everywhere: red is always "act now", whatever department the item comes from.
const LEVELS = [
  ["red", "Immediate", "See now"],
  ["orange", "Very urgent", "Within 10 min"],
  ["yellow", "Urgent", "Within 1 h"],
  ["green", "Standard", "Within 2 h"],
  ["blue", "Non-urgent", "Within 4 h"],
] as const;

interface Item {
  level: number;
  title: string;
  detail: string;
  factLabel: string;
  fact: string;
  // 0..1 when the fact has a natural scale (stock against its reorder level)
  meter?: number;
  action: string;
  to: string;
  primary?: boolean;
}

export default function Overview() {
  const { db } = useApp();
  const { t } = useI18n();
  const nav = useNavigate();
  const beds = wards.reduce((a, w) => a + w[1], 0),
    cap = wards.reduce((a, w) => a + w[2], 0);

  const items: Item[] = [
    ...db.laboratory
      .filter((x) => x.status === "Critical")
      .map((x) => ({
        level: 0,
        title: t("{test} critical for {patient}", {
          test: x.test,
          patient: x.patient,
        }),
        detail: `${x.id}, ${t(x.priority)}`,
        factLabel: t("Ordered"),
        fact: x.ordered,
        action: t("Review result"),
        to: "/laboratory",
        primary: true,
      })),
    ...db.pharmacy
      .filter((x) => x.stock === 0)
      .map((x) => ({
        level: 1,
        title: t("{item} is out of stock", { item: x.item }),
        detail: t(x.category),
        factLabel: t("In stock"),
        fact: t("{n} of {min}", { n: x.stock, min: x.reorderAt }),
        meter: 0,
        action: t("Reorder"),
        to: "/pharmacy",
        primary: true,
      })),
    ...db.admissions
      .filter((x) => x.status === "Waiting")
      .map((x) => ({
        level: 2,
        title: t("{patient} is waiting in {bed}", {
          patient: x.patient,
          bed: x.bed,
        }),
        detail: x.attending,
        factLabel: t("Arrived"),
        fact: formatDateTime(x.admitted).slice(11),
        action: t("Open chart"),
        to: `/admissions/${x.id}`,
      })),
    ...db.laboratory
      .filter(
        (x) =>
          x.priority === "STAT" &&
          ["Pending", "In progress"].includes(x.status),
      )
      .map((x) => ({
        level: 2,
        title: t("{test} STAT for {patient}", {
          test: x.test,
          patient: x.patient,
        }),
        detail: `${x.id}, ${t(x.status)}`,
        factLabel: t("Ordered"),
        fact: x.ordered,
        action: t("Open lab"),
        to: "/laboratory",
      })),
    ...db.pharmacy
      .filter((x) => x.stock > 0 && x.stock <= x.reorderAt)
      .map((x) => ({
        level: 2,
        title: t("{item} is low", { item: x.item }),
        detail: t(x.category),
        factLabel: t("In stock"),
        fact: t("{n} of {min}", { n: x.stock, min: x.reorderAt }),
        meter: x.stock / x.reorderAt,
        action: t("Reorder"),
        to: "/pharmacy",
      })),
    ...db.admissions
      .filter((x) => x.status === "Pending")
      .map((x) => ({
        level: 3,
        title: t("{patient} admission needs review", { patient: x.patient }),
        detail: `${x.id}, ${x.bed}, ${x.attending}`,
        factLabel: t("Admitted"),
        fact: formatDateTime(x.admitted),
        action: t("Review admission"),
        to: `/admissions/${x.id}`,
      })),
    ...db.billing
      .filter((x) => x.status === "Overdue")
      .map((x) => ({
        level: 4,
        title: t("Invoice {id} is overdue", { id: x.id }),
        detail: `${x.patient}, ${x.insurer}, ${formatCurrency(x.amount)}`,
        factLabel: t("Due"),
        fact: x.due,
        action: t("Open billing"),
        to: "/billing",
      })),
  ].sort((a, b) => a.level - b.level);

  const openLabs = db.laboratory.filter((x) =>
    ["Pending", "In progress", "Critical"].includes(x.status),
  ).length;
  const critLabs = db.laboratory.filter((x) => x.status === "Critical").length;
  const admitted = db.admissions.filter((x) => x.status !== "Discharged");
  const outstanding = db.billing.filter((x) => x.status !== "Paid");

  return (
    <PageFade>
      <div className="hd board-hd">
        <h1>{t("Priority board")}</h1>
        <div className="triage-key" aria-label={t("Triage levels")}>
          {LEVELS.map(([c, name]) => (
            <span key={c} className={`tri-${c}`}>
              {t(name)}
            </span>
          ))}
        </div>
      </div>

      <section className="board" aria-label={t("Priority board")}>
        {items.length ? (
          items.map((it) => {
            const [c, name, target] = LEVELS[it.level];
            return (
              <div className="band" key={it.title}>
                <div className={`band-pri tri-${c}`}>
                  <b>{t(name)}</b>
                  <small>{t(target)}</small>
                </div>
                <div className="band-what">
                  <b>{it.title}</b>
                  <span>{it.detail}</span>
                </div>
                <div className="band-fact">
                  <span>{it.factLabel}</span> <b>{it.fact}</b>
                  {it.meter !== undefined && (
                    <div className="meter" aria-hidden="true">
                      <i
                        className={it.meter < 0.5 ? "low" : ""}
                        style={{ width: `${Math.min(it.meter, 1) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="band-act">
                  <button
                    className={it.primary ? "b" : "g"}
                    onClick={() => nav(it.to)}
                  >
                    {it.action}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="board-empty">
            {t("Nothing needs attention right now.")}
          </p>
        )}
      </section>

      <section className="census">
        <div>
          <h2>{t("Bed census")}</h2>
          <div className="census-n">
            <AnimatedNumber value={beds} />
            <small>{t("of {cap} beds", { cap })}</small>
          </div>
        </div>
        <div className="census-wards">
          {wards.map(([name, used, total]) => {
            const p = used / total;
            return (
              <div className="ward" key={name}>
                <span>{t(name)}</span>
                <div className="bar" aria-hidden="true">
                  <div
                    className={p >= 0.9 ? "c" : ""}
                    style={{ width: `${p * 100}%` }}
                  />
                </div>
                <b>
                  {used}/{total}
                </b>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stats">
        <div className="stat-chart">
          <h2>{t("Admissions, last 7 days")}</h2>
          <Bars
            data={admissions7.data}
            labels={admissions7.labels.map((l) => t(l))}
            fontSize={20}
          />
        </div>
        <div>
          <h2>{t("Admitted now")}</h2>
          <div className="k">
            <AnimatedNumber value={admitted.length} />
          </div>
          <span className="sub">
            {t("{n} critical", {
              n: admitted.filter((x) => x.status === "Critical").length,
            })}
          </span>
        </div>
        <div>
          <h2>{t("Lab orders open")}</h2>
          <div className="k">
            <AnimatedNumber value={openLabs} />
          </div>
          <span className="sub">{t("{n} critical", { n: critLabs })}</span>
        </div>
        <div>
          <h2>{t("Outstanding billing")}</h2>
          <div className="k">
            {formatCurrency(outstanding.reduce((a, x) => a + x.amount, 0))}
          </div>
          <span className="sub">{t("Unpaid invoices")}</span>
        </div>
      </section>
    </PageFade>
  );
}
