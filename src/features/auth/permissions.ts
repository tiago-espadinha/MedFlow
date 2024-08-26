import type { Key } from "../../types/database";
import { roleInfo, type Role } from "./roles";

export const canView = (
  r: Role,
  page: Key | "overview" | "reports" | "settings",
) => roleInfo(r).pages.includes(page);
export const canEditHospitalName = (r: Role) => r === "admin";
