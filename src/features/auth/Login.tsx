import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ROLES, type Role } from "./roles";
import { LANGS } from "../../i18n/languages";
import { useI18n } from "../../i18n/I18nProvider";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import "./Login.css";

export default function Login() {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const { t, lang, setLang } = useI18n();
  const nav = useNavigate();
  const capitalize = (name: string) => {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return setErr(t("Choose a role to continue."));
    if (!name.trim()) return setErr(t("Enter your name."));
    login(role, capitalize(name.trim()));
    nav("/", { replace: true });
  };
  return (
    <div className="login">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="login-head">
          <div className="brand" style={{ padding: 0 }}>
            <img className="app-icon" src="/medflow_icon.svg" alt="" />
            MedFlow
          </div>
          <div className="login-head-controls">
            <select
              className="lang-select"
              aria-label={t("Language")}
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
            >
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            <ThemeToggle />
          </div>
        </div>
        <p className="sub" style={{ marginBottom: 20 }}>
          {t(
            "Sign in with a role to see the workspace built for it. This is a demo — any name works.",
          )}
        </p>
        <form onSubmit={submit}>
          <div className="role-grid">
            {ROLES.map((r) => (
              <motion.button
                type="button"
                key={r.id}
                className={`role-card ${role === r.id ? "on" : ""}`}
                onClick={() => setRole(r.id)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -2 }}
              >
                <b>{t(r.label)}</b>
                <span>{t(r.blurb)}</span>
              </motion.button>
            ))}
          </div>
          <label style={{ display: "grid", gap: 4, marginTop: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              {t("Your name")}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("e.g. Sam Rivera")}
              autoFocus
            />
          </label>
          <div className="err">{err}</div>
          <button
            className="b"
            type="submit"
            style={{ width: "100%", marginTop: 8 }}
          >
            {t("Enter workspace")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
