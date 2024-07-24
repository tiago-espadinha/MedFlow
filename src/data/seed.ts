import type { DB } from "../types/database";
import { doctors } from "./mock/doctors";
import { admissions } from "./mock/admissions";
import { laboratory } from "./mock/laboratory";
import { billing } from "./mock/billing";
import { pharmacy } from "./mock/pharmacy";
import { appointments } from "./mock/appointments";
import { vitals } from "./mock/vitals";
import { goals } from "./mock/goals";

export const seed: DB = {
  doctors,
  admissions,
  laboratory,
  billing,
  pharmacy,
  appointments,
  vitals,
  goals,
};
