import { Link } from "react-router-dom";
import { useApp } from "../../state/AppProvider";
import { Bars } from "../../components/charts/Bars";
import { Kpis } from "../../components/dashboard/Kpis";
import { PageFade } from "../../components/layout/PageFade";
import { admissions7, wards } from "../../data/dashboard";
import { formatCurrency } from "../../utils/currency";
import { useAuth } from "../auth/AuthProvider";
import { useI18n } from "../../i18n/I18nProvider";

export default function Overview() {
  const { db } = useApp();
  const { session } = useAuth();
  const { t } = useI18n();
  const beds = wards.reduce((a, w) => a + w[1], 0),
    cap = wards.reduce((a, w) => a + w[2], 0);
  const critLabs = db.laboratory.filter((x) => x.status === "Critical").length;
  const lowRx = db.pharmacy.filter((x) => x.stock <= x.reorderAt).length;
  const overdue = db.billing.filter((x) => x.status === "Overdue").length;
  const pendDis = db.admissions.filter((x) => x.status === "Pending").length;
  const alerts: [string, string, string][] = [
    critLabs
      ? [
          "crit",
          t("{n} critical lab results awaiting review", { n: critLabs }),
          "/laboratory",
        ]
      : null,
    lowRx
      ? [
          "crit",
          t("{n} pharmacy items at or below reorder level", { n: lowRx }),
          "/pharmacy",
        ]
      : null,
    pendDis
      ? [
          "warn",
          t("{n} admissions pending review", { n: pendDis }),
          "/admissions",
        ]
      : null,
    overdue
      ? ["warn", t("{n} overdue invoices", { n: overdue }), "/billing"]
      : null,
  ].filter(Boolean) as [string, string, string][];
  const kpis: [string, string | number, string][] = [
    [
      t("Bed occupancy"),
      `${Math.round((beds / cap) * 100)}%`,
      t("{beds} / {cap} beds", { beds, cap }),
    ],
    [
      t("ER waiting"),
      db.admissions.filter((x) => x.status === "Waiting").length,
      t("In queue"),
    ],
    [
      t("Active admissions"),
      db.admissions.filter((x) => x.status !== "Discharged").length,
      t("Currently admitted"),
    ],
    [
      t("Pending lab orders"),
      db.laboratory.filter((x) => ["Pending", "In progress"].includes(x.status))
        .length,
      t("{n} critical", { n: critLabs }),
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
    [t("Low-stock items"), lowRx, t("At or below reorder")],
  ];
  return (
    <PageFade>
      <div className="hd">
        <h1>
          {t("Welcome back")}
          {session ? `, ${session.name.split(" ")[0]}` : ""}
        </h1>
      </div>
      <Kpis items={kpis} />
      <div className="grid two">
        <div className="pan bars">
          <h2>{t("Admissions, last 7 days")}</h2>
          <Bars
            data={admissions7.data}
            labels={admissions7.labels.map((l) => t(l))}
          />
        </div>
        <div className="pan">
          <h2>{t("Ward occupancy")}</h2>
          {wards.map((w) => {
            const p = Math.round((w[1] / w[2]) * 100);
            return (
              <div key={w[0]}>
                {w[0]}
                <span className="sub" style={{ float: "right" }}>
                  {w[1]}/{w[2]} · {p}%
                </span>
                <div className="bar">
                  <div
                    className={p >= 90 ? "c" : p >= 80 ? "w" : ""}
                    style={{ width: `${p}%`, height: "100%", borderRadius: 9 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pan">
        <h2>{t("Needs attention")}</h2>
        {alerts.length ? (
          alerts.map(([c, tx, to]) => (
            <div className="li" key={tx}>
              <span>
                <span className={`pill ${c}`}>
                  {c === "crit" ? t("Critical") : t("Needs attention")}
                </span>{" "}
                &nbsp;{tx}
              </span>
              <Link to={to}>{t("Open")}</Link>
            </div>
          ))
        ) : (
          <div className="sub">{t("Nothing needs attention right now.")}</div>
        )}
      </div>
    </PageFade>
  );
}
