import type { Invoice } from "../../types/resources";
export const billing: Invoice[] = (
  [
    ["J. Ellis", 1240, "BlueShield", "2023-10-08", "Pending"],
    ["M. Rossi", 18760.5, "MedCare", "2023-10-15", "Partial"],
    ["T. Nakamura", 430, "Self-pay", "2023-09-20", "Overdue"],
    ["A. Diallo", 2115, "UniHealth", "2023-10-01", "Pending"],
    ["P. Hughes", 980, "BlueShield", "2023-09-12", "Paid"],
  ] as const
).map((r, i) => ({
  id: `INV-${20931 - i}`,
  patient: r[0],
  amount: r[1],
  insurer: r[2],
  due: r[3],
  status: r[4],
}));
