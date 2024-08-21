import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { NumberField } from "../../components/ui/NumberField";
import { useI18n } from "../../i18n/I18nProvider";
import { validateRequired, validateNumberField } from "../../utils/validation";
import type { Field } from "./resourceConfig";
import type { Row } from "../../types/database";

export function ResourceForm({
  fields,
  noun,
  initial,
  mode,
  onSave,
  onClose,
}: {
  fields: Field[];
  noun: string;
  initial?: Row;
  mode: "add" | "edit";
  onSave: (r: Record<string, string | number>) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [v, setV] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [
        f.key,
        initial
          ? String(initial[f.key] ?? "")
          : f.type === "select"
            ? f.options![0]
            : "",
      ]),
    ),
  );
  const [err, setErr] = useState("");

  const submit = () => {
    const out: Record<string, string | number> = {};
    for (const f of fields) {
      const raw = v[f.key].trim();
      const reqErr = validateRequired(raw, t(f.label), t);
      if (reqErr) return setErr(reqErr);
      if (f.type === "number") {
        const numErr = validateNumberField(raw, t(f.label), t);
        if (numErr) return setErr(numErr);
        out[f.key] = Number(raw);
      } else out[f.key] = raw;
    }
    onSave(out);
  };

  const heading =
    mode === "add"
      ? t("Add {noun}", { noun: t(noun) })
      : t("Edit {noun}", { noun: t(noun) });
  return (
    <Modal title={heading} onClose={onClose}>
      <h1>{heading}</h1>
      <div className="fg">
        {fields.map((f) => (
          <label key={f.key}>
            {t(f.label)}
            {f.type === "select" ? (
              <select
                value={v[f.key]}
                onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
              >
                {f.options!.map((o) => (
                  <option key={o} value={o}>
                    {t(o)}
                  </option>
                ))}
              </select>
            ) : f.type === "number" ? (
              <NumberField
                value={v[f.key]}
                onChange={(val) => setV({ ...v, [f.key]: val })}
              />
            ) : (
              <input
                type={f.type ?? "text"}
                value={v[f.key]}
                onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      <div className="err">{err}</div>
      <div className="acts">
        <button className="g" onClick={onClose}>
          {t("Cancel")}
        </button>
        <button className="b" onClick={submit}>
          {mode === "add"
            ? t("Save {noun}", { noun: t(noun) })
            : t("Save changes")}
        </button>
      </div>
    </Modal>
  );
}
