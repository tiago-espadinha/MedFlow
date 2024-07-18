import type { Appointment } from "../../types/resources";
export const appointments: Appointment[] = (
  [
    ["09:30", "J. Ellis", "Dr. Patel", "Follow-up", "C-104", "Checked in"],
    ["09:45", "L. Moreau", "Dr. Kowalski", "Consult", "N-201", "Confirmed"],
    ["10:00", "S. Park", "Dr. Brooks", "MRI", "IMG-2", "Confirmed"],
    ["10:15", "D. Amin", "Dr. Okafor", "Check-up", "B-110", "Scheduled"],
    ["10:30", "M. Rossi", "Dr. Patel", "Echo", "C-106", "Confirmed"],
    ["13:00", "A. Diallo", "Dr. Haddad", "Triage review", "ER-2", "Scheduled"],
  ] as const
).map((r, i) => ({
  id: `AP-${i + 1}`,
  time: r[0],
  patient: r[1],
  doctor: r[2],
  type: r[3],
  room: r[4],
  status: r[5],
}));
