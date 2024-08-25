import type { Key } from "../../types/database";

export type Role =
  "admin" | "doctor" | "nurse" | "receptionist" | "pharmacist" | "billing";

export interface RoleInfo {
  id: Role;
  label: string;
  blurb: string;
  pages: (Key | "overview" | "reports" | "settings")[];
  patientChart: boolean;
}

export const ROLES: RoleInfo[] = [
  {
    id: "admin",
    label: "Administrator",
    blurb: "Full access across every department",
    pages: [
      "overview",
      "doctors",
      "admissions",
      "laboratory",
      "billing",
      "pharmacy",
      "appointments",
      "reports",
      "settings",
    ],
    patientChart: true,
  },
  {
    id: "doctor",
    label: "Doctor",
    blurb: "Patients, admissions, labs and appointments",
    pages: [
      "overview",
      "admissions",
      "laboratory",
      "appointments",
      "doctors",
      "reports",
      "settings",
    ],
    patientChart: true,
  },
  {
    id: "nurse",
    label: "Nurse",
    blurb: "Ward care, vitals and patient charts",
    pages: [
      "overview",
      "admissions",
      "appointments",
      "laboratory",
      "pharmacy",
      "settings",
    ],
    patientChart: true,
  },
  {
    id: "receptionist",
    label: "Receptionist",
    blurb: "Admissions intake and appointment scheduling",
    pages: ["overview", "admissions", "appointments", "settings"],
    patientChart: false,
  },
  {
    id: "pharmacist",
    label: "Pharmacist",
    blurb: "Medication stock and dispensing",
    pages: ["overview", "pharmacy", "reports", "settings"],
    patientChart: false,
  },
  {
    id: "billing",
    label: "Billing staff",
    blurb: "Invoices, claims and collections",
    pages: ["overview", "billing", "reports", "settings"],
    patientChart: false,
  },
];

export const roleInfo = (r: Role) => ROLES.find((x) => x.id === r)!;
