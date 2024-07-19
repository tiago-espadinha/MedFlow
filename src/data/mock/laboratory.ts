import type { LabOrder } from "../../types/resources";
export const laboratory: LabOrder[] = (
  [
    ["M. Rossi", "Troponin I", "STAT", "08:20", "Critical"],
    ["J. Ellis", "Lipid panel", "Routine", "08:32", "In progress"],
    ["A. Diallo", "CBC", "STAT", "09:35", "Pending"],
    ["T. Nakamura", "Metabolic panel", "Routine", "07:50", "Completed"],
    ["P. Hughes", "HbA1c", "Routine", "07:12", "Completed"],
  ] as const
).map((r, i) => ({
  id: `LAB-${8841 + i}`,
  patient: r[0],
  test: r[1],
  priority: r[2],
  ordered: r[3],
  status: r[4],
}));
