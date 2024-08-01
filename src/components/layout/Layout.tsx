import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../../state/AppProvider";
import { RES, KEYS } from "../../features/resources/resourceConfig";
import { useAuth } from "../../features/auth/AuthProvider";
import { roleInfo } from "../../features/auth/roles";
import { canView } from "../../features/auth/permissions";
import { useI18n } from "../../i18n/I18nProvider";
import { ThemeToggle } from "../ui/ThemeToggle";
import { AccountMenu } from "./AccountMenu";
import "./Layout.css";

export default function Layout() {
  const { db, toast, settings } = useApp();
  const { session, logout } = useAuth();
  const { t } = useI18n();
  const nav = useNavigate();
  const loc = useLocation();
  const [drawer, setDrawer] = useState(false);
  // close the mobile drawer after navigating, or on Escape
  useEffect(() => {
    setDrawer(false);
  }, [loc.pathname]);
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer]);
  if (!session) return null;
  const role = roleInfo(session.role);
  const badge: Record<string, number> = {
    laboratory: db.laboratory.filter((x) => x.status === "Critical").length,
    pharmacy: db.pharmacy.filter((x) => x.stock <= x.reorderAt).length,
  };
  const links: [string, string, string][] = [
    ["/", "overview", t("Overview")],
    ...KEYS.map(
      (k) => [`/${k}`, k, t(RES[k].title)] as [string, string, string],
    ),
    ["/reports", "reports", t("Reports")],
  ];
  return (
    <div className="app">
      {/* Mobile only (hidden by CSS on desktop): slim bar with menu, theme toggle and account */}
      <header className="topbar">
        <div
          className={`topbar-left ${drawer ? "open" : ""}`}
          onClick={() => setDrawer((d) => !d)}
        >
          <div className="brand">
            <img className="app-icon" src="/medflow_icon.svg" alt="" />
            <span>MedFlow</span>
          </div>
        </div>
        <div className="topbar-right">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </header>
      <div
        className={`scrim ${drawer ? "show" : ""}`}
        onClick={() => setDrawer(false)}
        aria-hidden="true"
      />

      <aside className={drawer ? "open" : ""}>
        <div className="brand-row">
          <div className="brand">
            <img className="app-icon" src="/medflow_icon.svg" alt="" />
            MedFlow
          </div>
          <ThemeToggle />
        </div>
        {links
          .filter(([, page]) => canView(session.role, page as any))
          .map(([to, page, label]) => {
            const b = badge[page];
            return (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
                {b ? <b className="n">{b}</b> : null}
              </NavLink>
            );
          })}
        {canView(session.role, "settings") && (
          <NavLink to="/settings">{t("Settings")}</NavLink>
        )}
        <div className="side-user">
          <div className="av small">
            {session.name
              .split(" ")
              .map((x) => x[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <b
              style={{
                display: "block",
                fontSize: 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {session.name}
            </b>
            <span className="sub">{t(role.label)}</span>
          </div>
          <button
            className="x"
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            {t("Sign out")}
          </button>
        </div>
      </aside>
      <main>
        <div className="sub" style={{ marginBottom: 8 }}>
          {settings.hospital}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={loc.pathname}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <div id="toast" className={toast ? "s" : ""} role="status">
        {toast}
      </div>
    </div>
  );
}
