import type { Doctor } from "../../types/resources";
export const doctors: Doctor[] = (
  [
    [
      "Dr. A. Patel",
      "Cardiology",
      "Cardiac Unit",
      "Active",
      14,
      "Tomorrow 07:00",
    ],
    [
      "Dr. M. Okafor",
      "General Medicine",
      "Ward B",
      "Active",
      18,
      "Today 19:00",
    ],
    ["Dr. L. Nguyen", "Orthopaedics", "Surgery", "In surgery", 4, "Fri 08:00"],
    ["Dr. S. Haddad", "Emergency", "ER", "Active", 22, "Tomorrow 15:00"],
    ["Dr. R. Silva", "Paediatrics", "Ward C", "On leave", 0, "Mon 08:00"],
    [
      "Dr. E. Kowalski",
      "Neurology",
      "Neuro Unit",
      "Available",
      9,
      "Today 20:00",
    ],
  ] as const
).map((r, i) => ({
  id: `D${i + 1}`,
  name: r[0],
  specialty: r[1],
  department: r[2],
  status: r[3],
  patients: r[4],
  nextShift: r[5],
}));
