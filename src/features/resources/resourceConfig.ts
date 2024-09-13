import type { Key } from "../../types/database";
import { formatCurrency } from "../../utils/currency";

export interface Field {
  key: string;
  label: string;
  type?:
    "text" | "number" | "select" | "date" | "time" | "month" | "datetime-local";
  options?: string[];
}
export type TFunc = (
  key: string,
  vars?: Record<string, string | number>,
) => string;
export interface Res {
  title: string;
  noun: string;
  fields: Field[];
  kpis: (r: any[], t: TFunc) => [string, string | number, string][];
}

const st = (options: string[]): Field => ({
  key: "status",
  label: "Status",
  type: "select",
  options,
});
const n = (r: any[], ...s: string[]) =>
  r.filter((x) => s.includes(String(x.status))).length;

export const RES: Record<Key, Res> = {
  doctors: {
    title: "Doctors & staff",
    noun: "doctor",
    fields: [
      { key: "name", label: "Name" },
      { key: "specialty", label: "Specialty" },
      { key: "department", label: "Department" },
      st(["Active", "Available", "In surgery", "On leave"]),
      { key: "patients", label: "Patients today", type: "number" },
      { key: "nextShift", label: "Next shift" },
    ],
    kpis: (r, t) => [
      [
        t("On duty"),
        n(r, "Active", "Available"),
        t("of {n} staff", { n: r.length }),
      ],
      [t("In surgery"), n(r, "In surgery"), t("Now")],
      [t("On leave"), n(r, "On leave"), t("This week")],
      [
        t("Patients today"),
        r.reduce((a, x) => a + x.patients, 0),
        t("All doctors"),
      ],
    ],
  },
  admissions: {
    title: "Admissions",
    noun: "admission",
    fields: [
      { key: "patient", label: "Patient name" },
      { key: "dob", label: "Date of birth", type: "date" },
      {
        key: "sex",
        label: "Sex",
        type: "select",
        options: ["Female", "Male", "Other"],
      },
      { key: "bed", label: "Ward / bed" },
      { key: "admitted", label: "Admitted", type: "datetime-local" },
      { key: "attending", label: "Attending" },
      st([
        "Active",
        "Critical",
        "Observation",
        "Waiting",
        "Pending",
        "Discharged",
      ]),
    ],
    kpis: (r, t) => [
      [t("Admitted (kpi)"), r.length, t("Recent")],
      [t("Critical"), n(r, "Critical"), t("Needs attention")],
      [t("ER waiting"), n(r, "Waiting"), t("In queue")],
      [t("Discharged"), n(r, "Discharged"), t("Recent")],
    ],
  },
  laboratory: {
    title: "Laboratory",
    noun: "lab order",
    fields: [
      { key: "patient", label: "Patient" },
      { key: "test", label: "Test" },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        options: ["Routine", "STAT"],
      },
      { key: "ordered", label: "Ordered", type: "time" },
      st(["Pending", "In progress", "Completed", "Critical"]),
    ],
    kpis: (r, t) => [
      [t("Pending"), n(r, "Pending", "In progress"), t("In queue")],
      [t("Critical"), n(r, "Critical"), t("Needs review")],
      [
        t("STAT orders"),
        r.filter((x) => x.priority === "STAT").length,
        t("All statuses"),
      ],
      [t("Completed"), n(r, "Completed"), t("Today")],
    ],
  },
  billing: {
    title: "Billing",
    noun: "invoice",
    fields: [
      { key: "patient", label: "Patient" },
      { key: "amount", label: "Amount", type: "number" },
      { key: "insurer", label: "Insurer" },
      { key: "due", label: "Due date", type: "date" },
      st(["Pending", "Partial", "Overdue", "Paid"]),
    ],
    kpis: (r, t) => [
      [
        t("Outstanding"),
        formatCurrency(
          r
            .filter((x) => x.status !== "Paid")
            .reduce((a, x) => a + x.amount, 0),
        ),
        t("Unpaid invoices"),
      ],
      [
        t("Collected"),
        formatCurrency(
          r
            .filter((x) => x.status === "Paid")
            .reduce((a, x) => a + x.amount, 0),
        ),
        t("Paid"),
      ],
      [t("Overdue"), n(r, "Overdue"), t("Invoices")],
      [t("Claims pending"), n(r, "Pending", "Partial"), t("Insurer review")],
    ],
  },
  pharmacy: {
    title: "Pharmacy",
    noun: "item",
    fields: [
      { key: "item", label: "Item" },
      { key: "category", label: "Category" },
      { key: "stock", label: "Stock", type: "number" },
      { key: "reorderAt", label: "Reorder at", type: "number" },
      { key: "expiry", label: "Expiry", type: "month" },
      st(["In stock", "Low stock", "Out of stock", "Expiring"]),
    ],
    kpis: (r, t) => [
      [t("Low stock"), n(r, "Low stock"), t("Below reorder level")],
      [t("Out of stock"), n(r, "Out of stock"), t("Reorder now")],
      [t("Expiring"), n(r, "Expiring"), t("Review")],
      [t("Items tracked"), r.length, t("Total")],
    ],
  },
  appointments: {
    title: "Appointments",
    noun: "appointment",
    fields: [
      { key: "time", label: "Time", type: "time" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "type", label: "Type" },
      { key: "room", label: "Room" },
      st([
        "Scheduled",
        "Confirmed",
        "Checked in",
        "Completed",
        "No-show",
        "Cancelled",
      ]),
    ],
    kpis: (r, t) => [
      [t("Today"), r.length, t("Booked")],
      [t("Checked in"), n(r, "Checked in"), t("Waiting room")],
      [t("Confirmed"), n(r, "Confirmed"), t("Ready")],
      [t("No-shows"), n(r, "No-show"), t("Today")],
    ],
  },
};
export const KEYS = Object.keys(RES) as Key[];
