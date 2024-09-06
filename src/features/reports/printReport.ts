import type { ReportRow } from "./exportCsv";

const escHtml = (v: string | number) =>
  String(v).replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string,
  );

// Opens a bare print-friendly window with just the report table, rather than printing the
// whole dashboard. A production build would more likely render this server-side as a PDF —
// this is the honest client-only equivalent for a frontend-only demo.
export function printReport(
  title: string,
  columns: string[],
  rows: ReportRow[],
): void {
  const w = window.open("", "_blank", "width=860,height=640");
  if (!w) return;
  w.document
    .write(`<!doctype html><html><head><title>${escHtml(title)}</title><style>
    body{font-family:system-ui,sans-serif;padding:28px;color:#20313D}
    h1{font-size:18px;margin:0 0 16px}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #D9E1E7;padding:6px 10px;text-align:left;font-size:12px}
    th{background:#F6F7FB}
  </style></head><body><h1>${escHtml(title)}</h1><table><thead><tr>${columns.map((c) => `<th>${escHtml(c)}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${r.map((v) => `<td>${escHtml(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
