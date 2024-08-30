import { Link } from "react-router-dom";
import { useApp } from "../../state/AppProvider";
import { LineChart } from "../../components/charts/LineChart";
import { Kpis } from "../../components/dashboard/Kpis";
import { PageFade } from "../../components/layout/PageFade";
import { Pill } from "../../components/ui/Pill";
import { admissions7, wards } from "../../data/dashboard";
import { formatCurrency } from "../../utils/currency";
import { formatDateTime } from "../../utils/dates";
import { useI18n } from "../../i18n/I18nProvider";
import "./Overview.css";

const LOCALE = { en: "en-GB", pt: "pt-PT", es: "es-ES", fr: "fr-FR" } as const;

interface Row {
  status: string;
  rank: number;
  item: string;
  sub: string;
  who: string;
  detail: string;
  action: string;
  to: string;
}

export default function Overview() {
  const { db } = useApp();
  const { t, lang } = useI18n();
  const beds = wards.reduce((a, w) => a + w[1], 0),
    cap = wards.reduce((a, w) => a + w[2], 0);
  const critLabs = db.laboratory.filter((x) => x.status === "Critical").length;
  const lowRx = db.pharmacy.filter((x) => x.stock <= x.reorderAt);
  const outRx = lowRx.filter((x) => x.stock === 0).length;
  const now = new Date();

  // Everything that needs a person's sign-off, most urgent first: critical, then low, then pending.
  const rows: Row[] = [
    ...db.laboratory
      .filter((x) => x.status === "Critical")
      .map((x) => ({
        status: "Critical",
        rank: 0,
        item: `${x.test}, ${t(x.priority)}`,
        sub: x.id,
        who: x.patient,
        detail: t("Ordered {time}", { time: x.ordered }),
        action: t("Review result"),
        to: "/laboratory",
      })),
    ...lowRx.map((x) => ({
      status: x.stock === 0 ? "Out of stock" : "Low stock",
      rank: x.stock === 0 ? 0 : 1,
      item: x.item,
      sub: t(x.category),
      who: t("{n} of {min}", { n: x.stock, min: x.reorderAt }),
      detail: t("Reorder at {n}", { n: x.reorderAt }),
      action: t("Reorder"),
      to: "/pharmacy",
    })),
    ...db.laboratory
      .filter(
        (x) =>
          x.priority === "STAT" &&
          ["Pending", "In progress"].includes(x.status),
      )
      .map((x) => ({
        status: x.status,
        rank: 2,
        item: `${x.test}, STAT`,
        sub: x.id,
        who: x.patient,
        detail: t("Ordered {time}", { time: x.ordered }),
        action: t("Open lab"),
        to: "/laboratory",
      })),
    ...db.admissions
      .filter((x) => x.status === "Pending")
      .map((x) => ({
        status: "Pending",
        rank: 2,
        item: t("Admission review"),
        sub: `${x.id}, ${x.attending}`,
        who: `${x.patient}, ${x.bed}`,
        detail: t("Admitted {time}", { time: formatDateTime(x.admitted) }),
        action: t("Review"),
        to: `/admissions/${x.id}`,
      })),
    ...db.billing
      .filter((x) => x.status === "Overdue")
      .map((x) => ({
        status: "Overdue",
        rank: 3,
        item: t("Invoice {id}", { id: x.id }),
        sub: `${x.insurer}, ${formatCurrency(x.amount)}`,
        who: x.patient,
        detail: t("Due {date}", { date: x.due }),
        action: t("Open billing"),
        to: "/billing",
      })),
  ].sort((a, b) => a.rank - b.rank);

  const kpis: [string, string | number, string, boolean?][] = [
    [
      t("Bed occupancy"),
      `${Math.round((beds / cap) * 100)}%`,
      t("{beds} of {cap} beds", { beds, cap }),
    ],
    [
      t("ER waiting"),
      db.admissions.filter((x) => x.status === "Waiting").length,
      t("In queue"),
    ],
    [
      t("Admitted now"),
      db.admissions.filter((x) => x.status !== "Discharged").length,
      t("{n} critical", {
        n: db.admissions.filter((x) => x.status === "Critical").length,
      }),
    ],
    [
      t("Lab orders open"),
      db.laboratory.filter((x) => x.status !== "Completed").length,
      t("{n} critical", { n: critLabs }),
      critLabs > 0,
    ],
    [
      t("Outstanding billing"),
      formatCurrency(
        db.billing
          .filter((x) => x.status !== "Paid")
          .reduce((a, x) => a + x.amount, 0),
      ),
      t("Unpaid invoices"),
    ],
    [
      t("Low-stock items"),
      lowRx.length,
      t("{n} out of stock", { n: outRx }),
      outRx > 0,
    ],
  ];

  return (
    <PageFade>
      <div className="hd">
        <h1>{t("Overview")}</h1>
        <div className="fields">
          <div>
            {t("Date")}
            <b>
              {now.toLocaleDateString(LOCALE[lang], {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </b>
          </div>
          <div>
            {t("Time")}
            <b>
              {now.toLocaleTimeString(LOCALE[lang], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </b>
          </div>
          <div>
            {t("Census")}
            <b>{t("{beds} / {cap} beds", { beds, cap })}</b>
          </div>
        </div>
      </div>

      <Kpis items={kpis} />

      <div className="grid ov-charts">
        <section className="pan flush">
          <div className="ph">
            <h2>{t("Admissions per day")}</h2>
            <span className="sub">
              {t("Dashed line shows the 7-day average")}
            </span>
          </div>
          <LineChart
            data={admissions7.data}
            dates={admissions7.labels.map((l) => t(l))}
            unit={t("admissions")}
            zero
            calibration
            average
            valueLabels="all"
            lastLabel={t("Today")}
          />
        </section>
        <section className="pan flush">
          <div className="ph">
            <h2>{t("Ward occupancy")}</h2>
            <span className="sub">{t("Dashed line at 90%")}</span>
          </div>
          <div className="wards">
            {wards.map(([name, used, total]) => {
              const hot = used / total >= 0.9;
              return (
                <div className={hot ? "ward hot" : "ward"} key={name}>
                  <span className="ward-name">{t(name)}</span>
                  <span className="ward-bar" aria-hidden="true">
                    <i style={{ width: `${(used / total) * 100}%` }} />
                  </span>
                  <span className="ward-n">
                    {hot && <small>≥90</small>}
                    {used}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="pan flush">
        <div className="ph">
          <h2>{t("Needs a signature")}</h2>
          <span className="sub">{t("Most urgent first")}</span>
        </div>
        {rows.length ? (
          <div className="sc">
            <table>
              <thead>
                <tr>
                  <th>{t("Flag")}</th>
                  <th>{t("Item")}</th>
                  <th>{t("Patient or stock")}</th>
                  <th>{t("Detail")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.item + r.sub}>
                    <td>
                      <Pill s={r.status} />
                    </td>
                    <td>
                      {r.item}
                      <span className="sub cell-sub">{r.sub}</span>
                    </td>
                    <td>{r.who}</td>
                    <td>{r.detail}</td>
                    <td>
                      <Link to={r.to}>{r.action}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="sub empty">{t("Nothing needs attention right now.")}</p>
        )}
      </section>
    </PageFade>
  );
}
