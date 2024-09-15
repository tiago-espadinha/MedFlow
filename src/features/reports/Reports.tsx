import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useApp } from "../../state/AppProvider";
import { Bars } from "../../components/charts/Bars";
import { PageFade } from "../../components/layout/PageFade";
import { Modal } from "../../components/ui/Modal";
import { monthly } from "../../data/dashboard";
import { formatCurrency } from "../../utils/currency";
import { useI18n } from "../../i18n/I18nProvider";
import type { DB } from "../../types/database";
import { downloadCSV, type ReportRow } from "./exportCsv";
import { printReport } from "./printReport";

// Each report is built from the live mock database, not static text, so the numbers move
// as records are added/edited/deleted elsewhere in the app.
function buildReport(
  name: string,
  db: DB,
  t: (k: string, v?: Record<string, string | number>) => string,
): { columns: string[]; rows: ReportRow[] } {
  switch (name) {
    case "Daily census":
      return {
        columns: [t("Patient"), t("Ward / bed"), t("Status"), t("Attending")],
        rows: db.admissions.map((a) => [
          a.patient,
          a.bed,
          t(a.status),
          a.attending,
        ]),
      };
    case "Admissions and discharges":
      return {
        columns: [t("Patient"), t("Admitted"), t("Status")],
        rows: db.admissions.map((a) => [
          a.patient,
          a.admitted.replace("T", " "),
          t(a.status),
        ]),
      };
    case "Lab turnaround":
      return {
        columns: [t("ID"), t("Patient"), t("Test"), t("Priority"), t("Status")],
        rows: db.laboratory.map((l) => [
          l.id,
          l.patient,
          l.test,
          t(l.priority),
          t(l.status),
        ]),
      };
    case "Revenue and collections":
      return {
        columns: [
          t("ID"),
          t("Patient"),
          t("Amount"),
          t("Insurer"),
          t("Status"),
        ],
        rows: db.billing.map((b) => [
          b.id,
          b.patient,
          formatCurrency(b.amount),
          b.insurer,
          t(b.status),
        ]),
      };
    case "Pharmacy inventory":
      return {
        columns: [
          t("Item"),
          t("Category"),
          t("Stock"),
          t("Reorder at"),
          t("Expiry"),
          t("Status"),
        ],
        rows: db.pharmacy.map((p) => [
          p.item,
          p.category,
          p.stock,
          p.reorderAt,
          p.expiry,
          t(p.status),
        ]),
      };
    case "Staff utilisation":
      return {
        columns: [
          t("Name"),
          t("Specialty"),
          t("Department"),
          t("Status"),
          t("Patients today"),
        ],
        rows: db.doctors.map((d) => [
          d.name,
          d.specialty,
          d.department,
          t(d.status),
          d.patients,
        ]),
      };
    default:
      return { columns: [], rows: [] };
  }
}

export default function Reports() {
  const { db } = useApp();
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);
  const names = [
    "Daily census",
    "Admissions and discharges",
    "Lab turnaround",
    "Revenue and collections",
    "Pharmacy inventory",
    "Staff utilisation",
  ];
  const active = open ? buildReport(open, db, t) : null;
  return (
    <PageFade>
      <div className="hd">
        <h1>{t("Reports")}</h1>
      </div>
      <div className="grid two">
        <div className="pan bars">
          <h2>{t("Monthly admissions, {y}", { y: 2023 })}</h2>
          <Bars data={monthly.data} labels={monthly.labels.map((l) => t(l))} />
        </div>
        <div className="pan">
          <h2>{t("Generate report")}</h2>
          {names.map((r) => (
            <div className="li" key={r}>
              {t(r)}
              <button className="g" onClick={() => setOpen(r)}>
                {t("Generate")}
              </button>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open && active && (
          <Modal title={t(open)} onClose={() => setOpen(null)} wide>
            <h1>{t(open)}</h1>
            <div className="sub" style={{ marginBottom: 12 }}>
              {active.rows.length} {t("records")}
            </div>
            <div
              className="sc"
              style={{ maxHeight: "48vh", overflowY: "auto", overscrollBehavior: "contain" }}
            >
              <table>
                <thead>
                  <tr>
                    {active.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {active.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((v, j) => (
                        <td key={j}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="acts" style={{ marginTop: 16 }}>
              <button className="g" onClick={() => setOpen(null)}>
                {t("Close")}
              </button>
              <button
                className="g"
                onClick={() =>
                  printReport(t(open), active.columns, active.rows)
                }
              >
                {t("Print")}
              </button>
              <button
                className="b"
                onClick={() =>
                  downloadCSV(
                    `${open.replace(/\s+/g, "-").toLowerCase()}.csv`,
                    active.columns,
                    active.rows,
                  )
                }
              >
                {t("Download CSV")}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </PageFade>
  );
}
