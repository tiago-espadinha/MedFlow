import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useApp } from "../../state/AppProvider";
import { useAuth } from "../auth/AuthProvider";
import { roleInfo } from "../auth/roles";
import { useI18n } from "../../i18n/I18nProvider";
import { Kpis } from "../../components/dashboard/Kpis";
import { PageFade } from "../../components/layout/PageFade";
import { RES } from "./resourceConfig";
import { ResourceTable } from "./ResourceTable";
import { ResourceForm } from "./ResourceForm";
import { ResourceModal } from "./ResourceModal";
import type { Key, Row } from "../../types/database";

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function Resource() {
  const { key } = useParams();
  const k = key as Key;
  const res = RES[k];
  const { db, add, update, remove, notify } = useApp();
  const { session } = useAuth();
  const { t } = useI18n();
  const [q, setQ] = useState(""),
    [sf, setSf] = useState("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [detailRow, setDetailRow] = useState<Row | null>(null);
  useEffect(() => {
    setQ("");
    setSf("all");
    setOpenAdd(false);
    setEditRow(null);
    setDetailRow(null);
  }, [key]);
  if (!res) return <Navigate to="/" replace />;

  const all = db[k] as unknown as Row[];
  const statuses = res.fields.find((f) => f.key === "status")!.options!;
  const rows = all.filter(
    (r) =>
      (sf === "all" || r.status === sf) &&
      Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  const canChart = session ? roleInfo(session.role).patientChart : false;
  const doDelete = (row: Row) => {
    remove(k, row.id);
    notify(t("{noun} deleted", { noun: cap(t(res.noun)) }));
    setDetailRow(null);
  };

  return (
    <PageFade>
      <div className="hd">
        <h1>{t(res.title)}</h1>
        <button className="b" onClick={() => setOpenAdd(true)}>
          + {t("Add {noun}", { noun: t(res.noun) })}
        </button>
      </div>
      <Kpis items={res.kpis(all, t)} />
      <ResourceTable
        k={k}
        noun={res.noun}
        fields={res.fields}
        rows={rows}
        statuses={statuses}
        sf={sf}
        setSf={setSf}
        q={q}
        setQ={setQ}
        canChart={canChart}
        onOpenDetail={setDetailRow}
        onDelete={doDelete}
        searchPlaceholder={t("Search {title}", {
          title: t(res.title).toLowerCase(),
        })}
      />
      <AnimatePresence>
        {openAdd && (
          <ResourceForm
            fields={res.fields}
            noun={res.noun}
            mode="add"
            onClose={() => setOpenAdd(false)}
            onSave={(r) => {
              add(k, r);
              setOpenAdd(false);
              notify(t("{noun} added", { noun: cap(t(res.noun)) }));
            }}
          />
        )}
        {editRow && (
          <ResourceForm
            fields={res.fields}
            noun={res.noun}
            mode="edit"
            initial={editRow}
            onClose={() => setEditRow(null)}
            onSave={(r) => {
              update(k, editRow.id, r);
              setEditRow(null);
              setDetailRow(null);
              notify(t("{noun} updated", { noun: cap(t(res.noun)) }));
            }}
          />
        )}
        {detailRow && !editRow && (
          <ResourceModal
            row={detailRow}
            fields={res.fields}
            noun={res.noun}
            k={k}
            canChart={canChart}
            onClose={() => setDetailRow(null)}
            onEdit={() => setEditRow(detailRow)}
            onDelete={() => doDelete(detailRow)}
          />
        )}
      </AnimatePresence>
    </PageFade>
  );
}
