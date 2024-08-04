import { useI18n } from "../../i18n/I18nProvider";
import "./Pill.css";

export const pillClass = (s: string) =>
  /^(Active|Available|Completed|Paid|In stock|Confirmed|Discharged|Checked in|Routine|Normal)$/.test(
    s,
  )
    ? "ok"
    : /^(On leave|Low stock|Partial|Observation|In surgery|Elevated)$/.test(s)
      ? "warn"
      : /^(Pending|In progress|Waiting|Scheduled)$/.test(s)
        ? "pend"
        : /^(Critical|Overdue|Out of stock|Cancelled|No-show|STAT|Expiring|High|Low)$/.test(
              s,
            )
          ? "crit"
          : "neu";

export function Pill({ s }: { s: string }) {
  const { t } = useI18n();
  return <span className={`pill ${pillClass(s)}`}>{t(s)}</span>;
}
