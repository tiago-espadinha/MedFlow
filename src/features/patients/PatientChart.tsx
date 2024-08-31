import { useState } from "react";
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
      <div className="hd">
        <h1 style={{ marginTop: 4 }}>{adm.patient}</h1>
        <div className="btns">
          <Link to="/admissions" className="sub">
            {t("Back to admissions")}
          </Link>
          <button className="b" onClick={() => setOpenAdd(true)}>
            + {t("Add reading")}
          </button>
        </div>
      </div>
      <div className="pt">
        <div className="av">
          {adm.patient
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <span>{t("MRN")}</span>
          <b>{adm.id}</b>
        </div>
        <div>
          <span>{t("DOB / age")}</span>
          {adm.dob} / {age}
        </div>
        <div>
          <span>{t("Sex")}</span>
          {t(adm.sex)}
        </div>
        <div>
          <span>{t("Ward / bed")}</span>
          {adm.bed}
        </div>
        <div>
          <span>{t("Attending")}</span>
          {adm.attending}
        </div>
        <div>
          <span>{t("Status")}</span>
          <Pill s={adm.status} />
        </div>
      </div>
      <div className="grid kp">
        {(Object.keys(METRIC_LABEL) as Vital["metric"][]).map((m) => {
          const l = latest(m);
          if (!l) return null;
          return (
            <div className="card" key={m}>
              <h2>{t(METRIC_LABEL[m][0])}</h2>
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
        <div className="pan lines">
          <h2 style={{ display: "flex", justifyContent: "space-between" }}>
            {t("Trend")}
            <span className="tabs">
              {(Object.keys(METRIC_LABEL) as Vital["metric"][])
                .filter((m) => byMetric(m).length)
                .map((m) => (
                  <button
                    key={m}
                    className={tab === m ? "on" : ""}
                    onClick={() => setTab(m)}
                  >
                    {t(METRIC_LABEL[m][0])}
                  </button>
                ))}
            </span>
          </h2>
          {byMetric(tab).length ? (
            <LineChart
              data={byMetric(tab).map((v) => v.a)}
              dates={byMetric(tab).map((v) => shortDate(v.date))}
              unit={METRIC_LABEL[tab][1]}
            />
          ) : (
            <div className="sub">{t("No readings yet for this metric.")}</div>
          )}
        </div>
        <div className="pan">
          <h2>{t("Goals")}</h2>
          {goals.length ? (
            goals.map((g) => (
              <div className="li" key={g.id} style={{ display: "block" }}>
                {g.name}
                <div className="bar">
                  <div
                    style={{
                      width: `${g.pct}%`,
                      height: "100%",
                      background: "var(--pri)",
                      borderRadius: 9,
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
          <h2>{t("Reading history")}</h2>
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
                      <td>{t(METRIC_LABEL[v.metric][0])}</td>
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
          <h2>{t("Appointments")}</h2>
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
