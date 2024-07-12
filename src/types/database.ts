import type {
  Doctor,
  Admission,
  LabOrder,
  Invoice,
  Drug,
  Appointment,
} from "./resources";
import type { Vital, Goal } from "./patient";

export interface DB {
  doctors: Doctor[];
  admissions: Admission[];
  laboratory: LabOrder[];
  billing: Invoice[];
  pharmacy: Drug[];
  appointments: Appointment[];
  vitals: Record<string, Vital[]>;
  goals: Record<string, Goal[]>;
}
// The six tables that behave like generic CRUD resources (vitals/goals are keyed differently, so excluded).
export type Key = keyof Pick<
  DB,
  | "doctors"
  | "admissions"
  | "laboratory"
  | "billing"
  | "pharmacy"
  | "appointments"
>;
export type Row = { id: string } & Record<string, string | number>;
