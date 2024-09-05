export type ReportRow = (string | number)[];

function esc(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export function toCSV(columns: string[], rows: ReportRow[]): string {
  return [
    columns.map(esc).join(","),
    ...rows.map((r) => r.map(esc).join(",")),
  ].join("\n");
}
export function downloadCSV(
  filename: string,
  columns: string[],
  rows: ReportRow[],
): void {
  const blob = new Blob([toCSV(columns, rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
