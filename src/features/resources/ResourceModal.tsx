import { Link } from "react-router-dom";
import { Modal } from "../../components/ui/Modal";
import { Pill } from "../../components/ui/Pill";
import { formatCurrency } from "../../utils/currency";
import { formatDateTime } from "../../utils/dates";
import { useI18n } from "../../i18n/I18nProvider";
import type { Field } from "./resourceConfig";
import type { Key, Row } from "../../types/database";
import "./ResourceModal.css";

const displayVal = (f: Field, raw: string | number) =>
  f.type === "datetime-local" ? formatDateTime(String(raw)) : raw;

export function ResourceModal({
  row,
  fields,
  noun,
  k,
  onClose,
  onEdit,
  onDelete,
  canChart,
}: {
  row: Row;
  fields: Field[];
  noun: string;
  k: Key;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canChart: boolean;
}) {
  const { t } = useI18n();
  return (
    <Modal title={t("{noun} detail", { noun: t(noun) })} onClose={onClose}>
      <h1 style={{ marginBottom: 2 }}>
        {row.patient ?? row.name ?? row.item ?? row.id}
      </h1>
      <div className="sub" style={{ marginBottom: 14 }}>
        {row.id}
      </div>
      <div className="detail-grid">
        {fields.map((f) => (
          <div key={f.key} className="detail-row">
            <span className="sub">{t(f.label)}</span>
            <span>
              {f.key === "status" ? (
                <Pill s={String(row.status)} />
              ) : f.key === "amount" ? (
                formatCurrency(Number(row.amount))
              ) : (
                displayVal(f, row[f.key])
              )}
            </span>
          </div>
        ))}
      </div>
      <div
        className="acts"
        style={{ marginTop: 18, justifyContent: "space-between" }}
      >
        <button className="x" onClick={onDelete}>
          {t("Delete {noun}", { noun: t(noun) })}
        </button>
        <div className="acts">
          <button className="g" onClick={onClose}>
            {t("Close")}
          </button>
          <button className="b" onClick={onEdit}>
            {t("Edit {noun}", { noun: t(noun) })}
          </button>
          {k === "admissions" && canChart && (
            <Link className="g" to={`/admissions/${row.id}`} onClick={onClose}>
              {t("Open patient chart")}
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
}
