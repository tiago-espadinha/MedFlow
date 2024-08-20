import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Pill } from "../../components/ui/Pill";
import { ListItem } from "../../components/ui/ListItem";
import { formatCurrency } from "../../utils/currency";
import { formatDateTime } from "../../utils/dates";
import { useI18n } from "../../i18n/I18nProvider";
import type { Field } from "./resourceConfig";
import type { Key, Row } from "../../types/database";

const displayVal = (f: Field, raw: string | number) =>
  f.type === "datetime-local" ? formatDateTime(String(raw)) : raw;

export function ResourceTable({
  k,
  noun,
  fields,
  rows,
  statuses,
  sf,
  setSf,
  q,
  setQ,
  canChart,
  onOpenDetail,
  onDelete,
  searchPlaceholder,
}: {
  k: Key;
  noun: string;
  fields: Field[];
  rows: Row[];
  statuses: string[];
  sf: string;
  setSf: (s: string) => void;
  q: string;
  setQ: (s: string) => void;
  canChart: boolean;
  onOpenDetail: (r: Row) => void;
  onDelete: (r: Row) => void;
  searchPlaceholder: string;
}) {
  const { t } = useI18n();
  return (
    <div className="pan">
      <div className="tools">
        <input
          placeholder={searchPlaceholder}
          aria-label={t("Search")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        />
        <select
          aria-label={t("Filter by status")}
          value={sf}
          onChange={(e) => setSf(e.target.value)}
        >
          <option value="all">{t("All statuses")}</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>
      </div>
      <div className="sc">
        <table>
          <thead>
            <tr>
              <th>{t("ID")}</th>
              {fields.map((f) => (
                <th key={f.key}>{t(f.label)}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((r) => (
                <ListItem key={r.id} k={r.id}>
                  <td className="sub link-cell" onClick={() => onOpenDetail(r)}>
                    {r.id}
                  </td>
                  {fields.map((f) => (
                    <td
                      key={f.key}
                      onClick={() => onOpenDetail(r)}
                      className="link-cell"
                    >
                      {f.key === "status" ? (
                        <Pill s={String(r.status)} />
                      ) : f.key === "amount" ? (
                        formatCurrency(Number(r.amount))
                      ) : (
                        displayVal(f, r[f.key])
                      )}
                    </td>
                  ))}
                  <td>
                    {k === "admissions" && canChart && (
                      <Link className="g" to={`/admissions/${r.id}`}>
                        {t("Chart")}
                      </Link>
                    )}
                    <button className="x" onClick={() => onDelete(r)}>
                      {t("Delete")}
                    </button>
                  </td>
                </ListItem>
              ))}
            </AnimatePresence>
            {!rows.length && (
              <tr>
                <td colSpan={fields.length + 2} className="sub">
                  {t(
                    "No matching records. Clear the filters or add a {noun}.",
                    { noun: t(noun) },
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
