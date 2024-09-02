import type { Vital } from "../../types/patient";

// Clinical thresholds used to derive a vital reading's status. Kept as one pure function so
// the same rule is used whether a reading comes from the seed data or a new entry in VitalForm.
export function vitalStatus(m: Vital["metric"], a: number, b?: number): string {
  if (m === "bp")
    return a >= 140 || (b ?? 0) >= 90
      ? "High"
      : a >= 130 || (b ?? 0) >= 80
        ? "Elevated"
        : a < 90
          ? "Low"
          : "Normal";
  if (m === "hr") return a < 50 ? "Low" : a > 100 ? "High" : "Normal";
  if (m === "glu")
    return a < 70 ? "Low" : a > 125 ? "High" : a > 99 ? "Elevated" : "Normal";
  if (m === "sl") return a < 7 ? "Low" : "Normal";
  return "Normal";
}
