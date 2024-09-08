import { useApp } from "../../state/AppProvider";
import { PageFade } from "../../components/layout/PageFade";
import { useAuth } from "../auth/AuthProvider";
import { canEditHospitalName } from "../auth/permissions";
import { roleInfo } from "../auth/roles";
import { LANGS } from "../../i18n/languages";
import { useI18n } from "../../i18n/I18nProvider";
import "./Settings.css";

export default function Settings() {
  const { settings: s, setSettings, notify, reset } = useApp();
  const { session } = useAuth();
  const { t, lang, setLang } = useI18n();
  const canName = session ? canEditHospitalName(session.role) : false;
  const Tg = ({
    k,
    label,
  }: {
    k: "dark" | "crit" | "low" | "daily";
    label: string;
  }) => (
    <div className="row">
      {label}
      <button
        className={`tg ${s[k] ? "on" : ""}`}
        role="switch"
        aria-checked={s[k]}
        aria-label={label}
        onClick={() => setSettings({ [k]: !s[k] })}
      />
    </div>
  );
  return (
    <PageFade>
      <div className="hd">
        <h1>{t("Settings")}</h1>
      </div>
      <div className="pan set">
        <h2>{t("Account")}</h2>
        <div className="row">
          {t("Signed in as")}
          <span>
            {session?.name} · {session && t(roleInfo(session.role).label)}
          </span>
        </div>
        <h2 style={{ marginTop: 18 }}>{t("General")}</h2>
        <div className="row">
          {t("Hospital name")}
          {canName ? (
            <input
              value={s.hospital}
              onChange={(e) => setSettings({ hospital: e.target.value })}
            />
          ) : (
            <span className="sub">
              {s.hospital} {t("(admin only)")}
            </span>
          )}
        </div>
        <div className="row">
          {t("Language")}
          <select
            className="lang-select"
            style={{ width: "auto" }}
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <Tg k="dark" label={t("Dark mode")} />
        <h2 style={{ marginTop: 18 }}>{t("Notifications")}</h2>
        <Tg k="crit" label={t("Critical lab results")} />
        <Tg k="low" label={t("Low-stock pharmacy alerts")} />
        <Tg k="daily" label={t("Daily summary email")} />
        <div className="acts" style={{ marginTop: 16 }}>
          <button className="g" onClick={reset}>
            {t("Restore sample data")}
          </button>
          <button className="b" onClick={() => notify(t("Settings saved"))}>
            {t("Save changes")}
          </button>
        </div>
      </div>
    </PageFade>
  );
}
