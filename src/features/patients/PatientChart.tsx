import { useState, type CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useApp } from "../../state/AppProvider";
import { METRIC_LABEL, type Vital } from "../../types/patient";
import { Pill } from "../../components/ui/Pill";
import { PageFade } from "../../components/layout/PageFade";
import { AnimatePresence } from "framer-motion";
import { LineChart } from "../../components/charts/LineChart";
import { useAuth } from "../auth/AuthProvider";
import { roleInfo } from "../auth/roles";
import { useI18n } from "../../i18n/I18nProvider";
import { shortDate, calcAge } from "../../utils/dates";
import { VitalForm } from "./VitalForm";
import "./PatientChart.css";

// Each vital keeps its bedside-monitor colour wherever it appears.
const METRIC_COLOR: Record<Vital["metric"], string> = {
  bp: "var(--p-bp)",
  hr: "var(--p-hr)",
  glu: "var(--p-glu)",
  wt: "var(--p-wt)",
  sl: "var(--p-sl)",
};
// Reference lines drawn on the trend, matching the limits in vitalStatus().
const THRESHOLDS: Partial<Record<Vital["metric"], [number, string][]>> = {
  bp: [
    [140, "High {n}"],
    [90, "High {n}"],
  ],
  hr: [
    [100, "High {n}"],
    [50, "Low {n}"],
  ],
  glu: [
    [125, "High {n}"],
    [70, "Low {n}"],
  ],
  sl: [[7, "Target {n}"]],
};

export default function PatientChart() {
  const { id } = useParams();
  const { db, removeVital, notify } = useApp();
  const { session } = useAuth();
  const { t } = useI18n();
  const [tab, setTab] = useState<Vital["metric"]>("bp");
  const [openAdd, setOpenAdd] = useState(false);
  const adm = db.admissions.find((a) => a.id === id);
  if (!adm) return <Navigate to="/admissions" replace />;
  if (session && !roleInfo(session.role).patientChart)
    return <Navigate to="/admissions" replace />;
  const vitals = (db.vitals[adm.id] || [])
    .slice()
    .sort((x, y) => (x.date < y.date ? -1 : 1));
  const goals = db.goals[adm.id] || [];
  const appts = db.appointments.filter((a) => a.patient === adm.patient);
  const byMetric = (m: Vital["metric"]) => vitals.filter((v) => v.metric === m);
  const latest = (m: Vital["metric"]) => {
    const l = byMetric(m);
    return l[l.length - 1];
  };
  const age = calcAge(adm.dob);
  return (
    <PageFade>
      <div className="hd pt-hd">
        <h1>{adm.patient}</h1>
        <div className="btns">
          <Link to="/admissions" className="sub">
            {t("Back to admissions")}
          </Link>
          <button className="b" onClick={() => setOpenAdd(true)}>
            + {t("Add reading")}
          </button>
        </div>
        <div className="fields">
          <div>
            {t("MRN")}
            <b>{adm.id}</b>
          </div>
          <div>
            {t("DOB / age")}
            <b>
              {adm.dob}, {age}
            </b>
          </div>
          <div>
            {t("Sex")}
            <b>{t(adm.sex)}</b>
          </div>
          <div>
            {t("Ward / bed")}
            <b>{adm.bed}</b>
          </div>
          <div>
            {t("Attending")}
            <b>{adm.attending}</b>
          </div>
          <div>
            {t("Status")}
            <b>
              <Pill s={adm.status} />
            </b>
          </div>
        </div>
      </div>
      <div className="grid kp vitals">
        {(Object.keys(METRIC_LABEL) as Vital["metric"][]).map((m) => {
          const l = latest(m);
          if (!l) return null;
          return (
            <div
              className="card"
              key={m}
              style={{ "--pc": METRIC_COLOR[m] } as CSSProperties}
            >
              <h2>
                {t(METRIC_LABEL[m][0])}
                <span className="sub">{shortDate(l.date)}</span>
              </h2>
              <div className="card-body">
                <div className="k">
                  {m === "bp" ? `${l.a}/${l.b}` : l.a}{" "}
                  <span className="sub">{METRIC_LABEL[m][1]}</span>
                </div>
                <Pill s={l.status} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid two">
        <div className="pan flush">
          <div className="ph">
            <h2>{t("{metric} trend", { metric: t(METRIC_LABEL[tab][0]) })}</h2>
            <span className="tabs" role="group" aria-label={t("Vital sign")}>
              {(Object.keys(METRIC_LABEL) as Vital["metric"][])
                .filter((m) => byMetric(m).length)
                .map((m) => (
                  <button
                    key={m}
                    className={tab === m ? "on" : ""}
                    aria-pressed={tab === m}
                    onClick={() => setTab(m)}
                  >
                    {t(METRIC_LABEL[m][0])}
                  </button>
                ))}
            </span>
          </div>
          {byMetric(tab).length ? (
            <>
              <LineChart
                key={tab}
                data={byMetric(tab).map((v) => v.a)}
                data2={
                  tab === "bp"
                    ? byMetric(tab).map((v) => v.b ?? v.a)
                    : undefined
                }
                dates={byMetric(tab).map((v) => shortDate(v.date))}
                unit={METRIC_LABEL[tab][1]}
                color={METRIC_COLOR[tab]}
                thresholds={(THRESHOLDS[tab] ?? []).map(([v, label]) => ({
                  value: v,
                  label: t(label, { n: v }),
                }))}
              />
              {tab === "bp" && (
                <div className="legend">
                  <span>
                    <svg width="26" height="10" aria-hidden="true">
                      <line
                        x1="0"
                        y1="5"
                        x2="26"
                        y2="5"
                        stroke="var(--p-bp)"
                        strokeWidth="2.5"
                      />
                      <circle cx="13" cy="5" r="3.5" fill="var(--p-bp)" />
                    </svg>
                    {t("Systolic")}
                  </span>
                  <span>
                    <svg width="26" height="10" aria-hidden="true">
                      <line
                        x1="0"
                        y1="5"
                        x2="26"
                        y2="5"
                        stroke="var(--p-bp)"
                        strokeWidth="2"
                        strokeDasharray="5 3"
                      />
                      <rect
                        x="10"
                        y="2"
                        width="6"
                        height="6"
                        fill="var(--pan)"
                        stroke="var(--p-bp)"
                        strokeWidth="1.6"
                      />
                    </svg>
                    {t("Diastolic")}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="sub empty-chart">
              {t("No readings yet for this metric.")}
            </div>
          )}
        </div>
        <div className="pan">
          <div className="ph">
            <h2>{t("Goals")}</h2>
          </div>
          {goals.length ? (
            goals.map((g) => (
              <div className="li" key={g.id} style={{ display: "block" }}>
                {g.name}
                <div className="bar">
                  <div
                    style={{
                      width: `${g.pct}%`,
                      height: "100%",
                      background: "var(--tx)",
                      borderRadius: 2,
                    }}
                  />
                </div>
                <small className="sub">{g.detail}</small>
              </div>
            ))
          ) : (
            <div className="sub">{t("No goals recorded.")}</div>
          )}
        </div>
      </div>
      <div className="grid two">
        <div className="pan">
          <div className="ph">
            <h2>{t("Reading history")}</h2>
          </div>
          <div className="sc">
            <table>
              <thead>
                <tr>
                  <th>{t("Date")}</th>
                  <th>{t("Metric")}</th>
                  <th>{t("Value")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Note")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {vitals
                  .slice()
                  .reverse()
                  .map((v) => (
                    <tr key={v.id}>
                      <td>{shortDate(v.date)}</td>
                      <td
                        style={{
                          color: METRIC_COLOR[v.metric],
                          fontWeight: 700,
                        }}
                      >
                        {t(METRIC_LABEL[v.metric][0])}
                      </td>
                      <td>
                        <b>{v.metric === "bp" ? `${v.a}/${v.b}` : v.a}</b>{" "}
                        <span className="sub">{METRIC_LABEL[v.metric][1]}</span>
                      </td>
                      <td>
                        <Pill s={v.status} />
                      </td>
                      <td className="sub">{v.note}</td>
                      <td>
                        <button
                          className="x"
                          onClick={() => {
                            removeVital(adm.id, v.id);
                            notify(t("Reading deleted"));
                          }}
                        >
                          {t("Delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                {!vitals.length && (
                  <tr>
                    <td colSpan={6} className="sub">
                      {t("No readings recorded yet.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pan">
          <div className="ph">
            <h2>{t("Appointments")}</h2>
          </div>
          {appts.length ? (
            appts.map((a) => (
              <div className="li" key={a.id}>
                <span>
                  {a.time} · {a.doctor}
                  <br />
                  <span className="sub">
                    {a.type} · {a.room}
                  </span>
                </span>
                <Pill s={a.status} />
              </div>
            ))
          ) : (
            <div className="sub">{t("No appointments scheduled.")}</div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {openAdd && (
          <VitalForm admId={adm.id} onClose={() => setOpenAdd(false)} />
        )}
      </AnimatePresence>
    </PageFade>
  );
}
