import type { Drug } from "../../types/resources";
export const pharmacy: Drug[] = (
  [
    ["Amoxicillin 500 mg", "Antibiotic", 120, 200, "2024-03", "Low stock"],
    ["Insulin glargine", "Endocrine", 340, 150, "2024-01", "In stock"],
    ["Morphine 10 mg/mL", "Analgesic", 18, 40, "2023-12", "Low stock"],
    ["Atorvastatin 20 mg", "Cardio", 900, 300, "2024-08", "In stock"],
    ["Heparin 5000 IU", "Anticoagulant", 0, 60, "2023-11", "Out of stock"],
  ] as const
).map((r, i) => ({
  id: `RX-${i + 1}`,
  item: r[0],
  category: r[1],
  stock: r[2],
  reorderAt: r[3],
  expiry: r[4],
  status: r[5],
}));
