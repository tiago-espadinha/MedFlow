// Per-patient clinical data: individual readings and care goals shown on the patient chart.
export interface Vital {
  id: string;
  metric: "bp" | "hr" | "glu" | "wt" | "sl";
  date: string;
  a: number;
  b?: number;
  note: string;
  status: string;
}
export interface Goal {
  id: string;
  name: string;
  detail: string;
  pct: number;
}

export const METRIC_LABEL: Record<Vital["metric"], [string, string]> = {
  bp: ["Blood pressure", "mmHg"],
  hr: ["Heart rate", "bpm"],
  glu: ["Glucose", "mg/dL"],
  wt: ["Weight", "kg"],
  sl: ["Sleep", "h"],
};
