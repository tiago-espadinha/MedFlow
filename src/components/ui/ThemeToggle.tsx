import { motion } from "framer-motion";
import { useApp } from "../../state/AppProvider";
import "./ThemeToggle.css";

// Small, discreet icon toggle — used in the sidebar, on Settings, and on the login screen,
// so dark mode is reachable from every screen without taking up visual weight.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { settings, setSettings } = useApp();
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      aria-label={
        settings.dark ? "Switch to light mode" : "Switch to dark mode"
      }
      onClick={() => setSettings({ dark: !settings.dark })}
    >
      <motion.span
        initial={false}
        animate={{ rotate: settings.dark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: "grid" }}
      >
        {settings.dark ? (
          <svg viewBox="0 0 20 20" width="15" height="15">
            <path
              fill="currentColor"
              d="M10 2a8 8 0 108 10.5A6.5 6.5 0 0110 2z"
              transform="translate(20 20) rotate(180)"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="15" height="15">
            <circle cx="10" cy="10" r="4" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M10 1v2.2M10 16.8V19M19 10h-2.2M3.2 10H1M16.1 3.9l-1.6 1.6M5.5 14.5l-1.6 1.6M16.1 16.1l-1.6-1.6M5.5 5.5L3.9 3.9" />
            </g>
          </svg>
        )}
      </motion.span>
    </button>
  );
}
