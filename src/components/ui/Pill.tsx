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

// Clinical results carry a lab-report flag letter: C critical, H high, L low, N normal.
// Class c / h / l / n styles the flag; everything else is a plain status tag.
const FLAGS: Record<string, [string, string]> = {
  Critical: ["C", "c"],
  "Out of stock": ["C", "c"],
  High: ["H", "h"],
  Elevated: ["H", "h"],
  Low: ["L", "l"],
  "Low stock": ["L", "l"],
  Normal: ["N", "n"],
};

export function Pill({ s }: { s: string }) {
  const { t } = useI18n();
  const flag = FLAGS[s];
  if (flag)
    return (
      <span className={`pill flag ${flag[1]}`}>
        <i aria-hidden="true">{flag[0]}</i>
        {t(s)}
      </span>
    );
  return <span className={`pill ${pillClass(s)}`}>{t(s)}</span>;
}
