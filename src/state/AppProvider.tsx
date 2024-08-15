import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { seed } from "../data/seed";
import type { DB, Key } from "../types/database";
import type { Vital } from "../types/patient";
import { useI18n } from "../i18n/I18nProvider";

export interface Settings {
  hospital: string;
  dark: boolean;
  crit: boolean;
  low: boolean;
  daily: boolean;
}
interface Ctx {
  db: DB;
  settings: Settings;
  toast: string;
  add: (k: Key, row: Record<string, string | number>) => string;
  update: (k: Key, id: string, row: Record<string, string | number>) => void;
  remove: (k: Key, id: string) => void;
  addVital: (admId: string, v: Omit<Vital, "id">) => void;
  removeVital: (admId: string, id: string) => void;
  setSettings: (s: Partial<Settings>) => void;
  notify: (m: string) => void;
  reset: () => void;
}
const C = createContext<Ctx>(null!);
export const useApp = () => useContext(C);
function load<T>(k: string, d: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
}
const defaults: Settings = {
  hospital: "St. Marin General Hospital",
  dark: false,
  crit: true,
  low: true,
  daily: false,
};
const genId = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export function AppProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [db, setDb] = useState<DB>(() => load("vv-db", seed));
  const [settings, set] = useState<Settings>(() => load("vv-set", defaults));
  const [toast, setToast] = useState("");
  useEffect(() => {
    localStorage.setItem("vv-db", JSON.stringify(db));
  }, [db]);
  useEffect(() => {
    localStorage.setItem("vv-set", JSON.stringify(settings));
  }, [settings]);
  // Apply the theme. On a real change (not the first paint) a temporary class enables colour
  // transitions on every element, then is removed so it never interferes with hover/motion styles.
  const prevDark = useRef<boolean | null>(null);
  useEffect(() => {
    const root = document.documentElement;
    let timer: number | undefined;
    if (prevDark.current !== null && prevDark.current !== settings.dark) {
      root.classList.add("theme-transition");
      timer = window.setTimeout(
        () => root.classList.remove("theme-transition"),
        450,
      );
    }
    prevDark.current = settings.dark;
    root.dataset.theme = settings.dark ? "dark" : "light";
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [settings.dark]);
  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const add: Ctx["add"] = (k, row) => {
    const id = genId();
    setDb((d) => ({ ...d, [k]: [{ id, ...row }, ...(d[k] as any[])] }) as DB);
    return id;
  };
  const update: Ctx["update"] = (k, id, row) =>
    setDb(
      (d) =>
        ({
          ...d,
          [k]: (d[k] as any[]).map((x) => (x.id === id ? { ...x, ...row } : x)),
        }) as DB,
    );
  const remove: Ctx["remove"] = (k, id) =>
    setDb(
      (d) =>
        ({
          ...d,
          [k]: (d[k] as { id: string }[]).filter((x) => x.id !== id),
        }) as DB,
    );

  const addVital: Ctx["addVital"] = (admId, v) =>
    setDb((d) => ({
      ...d,
      vitals: {
        ...d.vitals,
        [admId]: [...(d.vitals[admId] || []), { id: genId(), ...v }],
      },
    }));
  const removeVital: Ctx["removeVital"] = (admId, id) =>
    setDb((d) => ({
      ...d,
      vitals: {
        ...d.vitals,
        [admId]: (d.vitals[admId] || []).filter((x) => x.id !== id),
      },
    }));

  const reset = () => {
    setDb(seed);
    notify(t("Sample data restored"));
  };
  return (
    <C.Provider
      value={{
        db,
        settings,
        toast,
        add,
        update,
        remove,
        addVital,
        removeVital,
        notify,
        reset,
        setSettings: (s) => set((p) => ({ ...p, ...s })),
      }}
    >
      {children}
    </C.Provider>
  );
}
