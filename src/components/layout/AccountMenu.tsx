import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../features/auth/AuthProvider";
import { roleInfo } from "../../features/auth/roles";
import { canView } from "../../features/auth/permissions";
import { useI18n } from "../../i18n/I18nProvider";
import "./AccountMenu.css";

// Avatar button + popover, used in the mobile top bar in place of the sidebar's user block.
export function AccountMenu() {
  const { session, logout } = useAuth();
  const { t } = useI18n();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session) return null;
  const initials = session.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="acct" ref={ref}>
      <button
        type="button"
        className="acct-btn"
        aria-label={t("Account")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="av">{initials}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="acct-pop"
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="acct-head">
              <span className="av small">{initials}</span>
              <div style={{ minWidth: 0 }}>
                <b>{session.name}</b>
                <span className="sub">{t(roleInfo(session.role).label)}</span>
              </div>
            </div>
            <div className="acct-sep" />
            {canView(session.role, "settings") && (
              <Link
                className="acct-item"
                role="menuitem"
                to="/settings"
                onClick={() => setOpen(false)}
              >
                {t("Settings")}
              </Link>
            )}
            <button
              type="button"
              className="acct-item danger"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
                nav("/login");
              }}
            >
              {t("Sign out")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
