import { useState } from "react";
import { useApp } from "../../state/AppProvider";
import { METRIC_LABEL, type Vital } from "../../types/patient";
import { vitalStatus } from "./patientUtils";
import { Modal } from "../../components/ui/Modal";
import { NumberField } from "../../components/ui/NumberField";
import { useI18n } from "../../i18n/I18nProvider";
import {
  validateVitalValue,
  validateDiastolic,
  validateDateField,
} from "../../utils/validation";

export function VitalForm({
  admId,
  onClose,
}: {
  admId: string;
  onClose: () => void;
}) {
  const { addVital, notify } = useApp();
  const { t } = useI18n();
  const [m, setM] = useState<Vital["metric"]>("bp");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [d, setD] = useState("2023-09-25");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  const save = () => {
    const valErr = validateVitalValue(a, t);
    if (valErr) return setErr(valErr);
    if (m === "bp") {
      const diaErr = validateDiastolic(b, t);
      if (diaErr) return setErr(diaErr);
    }
    const dateErr = validateDateField(d, t);
    if (dateErr) return setErr(dateErr);
    const av = Number(a),
      bv = m === "bp" ? Number(b) : undefined;
    addVital(admId, {
      metric: m,
      date: d.trim(),
      a: av,
      b: bv,
      note: note.trim(),
      status: vitalStatus(m, av, bv),
    });
    notify(t("Reading added"));
    onClose();
  };

  return (
    <Modal title={t("Add reading")} onClose={onClose}>
      <h1>{t("Add reading")}</h1>
      <div className="fg">
        <label>
          {t("Metric")}
          <select
            value={m}
            onChange={(e) => setM(e.target.value as Vital["metric"])}
          >
            {Object.entries(METRIC_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {t(v[0])}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("Date")}
          <input type="date" value={d} onChange={(e) => setD(e.target.value)} />
        </label>
        <label>
          {m === "bp"
            ? t("Systolic")
            : t("Value ({unit})", { unit: METRIC_LABEL[m][1] })}
          <NumberField value={a} onChange={setA} />
        </label>
        {m === "bp" && (
          <label>
            {t("Diastolic")}
            <NumberField value={b} onChange={setB} />
          </label>
        )}
        <label style={{ gridColumn: "1 / -1" }}>
          {t("Note (optional)")}
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      <div className="err">{err}</div>
      <div className="acts">
        <button className="g" onClick={onClose}>
          {t("Cancel")}
        </button>
        <button className="b" onClick={save}>
          {t("Save reading")}
        </button>
      </div>
    </Modal>
  );
}
