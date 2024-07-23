import type { Goal } from "../../types/patient";
export const goals: Record<string, Goal[]> = {
  "ADM-5521": [
    {
      id: "G1",
      name: "Weight to 80 kg",
      detail: "84.2 / 80 kg · due Dec 31",
      pct: 72,
    },
    {
      id: "G2",
      name: "Avg BP below 130/85",
      detail: "In progress · due Nov 30",
      pct: 45,
    },
    {
      id: "G3",
      name: "Sleep 7 h nightly",
      detail: "4 of 7 nights this week",
      pct: 60,
    },
  ],
  "ADM-5522": [
    {
      id: "G1",
      name: "Stabilise blood pressure",
      detail: "Target below 140/90",
      pct: 30,
    },
    {
      id: "G2",
      name: "Cardiac monitoring clear",
      detail: "48-hour observation",
      pct: 55,
    },
  ],
  "ADM-5523": [
    {
      id: "G1",
      name: "Fever-free 24 h",
      detail: "Currently afebrile 14 h",
      pct: 58,
    },
  ],
  "ADM-5524": [
    { id: "G1", name: "Pain score below 3", detail: "Currently at 4", pct: 40 },
  ],
  "ADM-5518": [
    {
      id: "G1",
      name: "HbA1c below 7%",
      detail: "Diabetes management",
      pct: 50,
    },
  ],
  "ADM-5510": [
    {
      id: "G1",
      name: "Post-discharge check-in",
      detail: "Scheduled for Oct 5",
      pct: 20,
    },
  ],
};
