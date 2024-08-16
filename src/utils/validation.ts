type TFunc = (key: string, vars?: Record<string, string | number>) => string;

// Generic field validators, used by ResourceForm for the add/edit modals across every resource.
export function validateRequired(
  raw: string,
  label: string,
  t: TFunc,
): string | null {
  return raw.trim() ? null : t("{label} is required.", { label });
}
export function validateNumberField(
  raw: string,
  label: string,
  t: TFunc,
): string | null {
  const x = Number(raw);
  return Number.isFinite(x) && x >= 0
    ? null
    : t("{label} must be a number, 0 or higher.", { label });
}

// Vital-reading specific validators (VitalForm), which need more specific messages than the
// generic ones above.
export function validateVitalValue(raw: string, t: TFunc): string | null {
  const x = Number(raw);
  return raw !== "" && Number.isFinite(x) ? null : t("Enter a valid value.");
}
export function validateDiastolic(raw: string, t: TFunc): string | null {
  const x = Number(raw);
  return Number.isFinite(x) && x > 0
    ? null
    : t("Enter a valid diastolic value.");
}
export function validateDateField(raw: string, t: TFunc): string | null {
  return raw.trim() ? null : t("Enter a date.");
}
