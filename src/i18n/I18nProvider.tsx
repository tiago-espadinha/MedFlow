import { createContext, useContext, useState, type ReactNode } from "react";
import { DICT } from "./translations";
import { type Lang } from "./languages";

type Vars = Record<string, string | number>;
interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Vars) => string;
}
const C = createContext<Ctx>(null!);
export const useI18n = () => useContext(C);

function load(): Lang {
  try {
    const v = localStorage.getItem("vv-lang") as Lang | null;
    return v && ["en", "pt", "es", "fr"].includes(v) ? v : "en";
  } catch {
    return "en";
  }
}
function fill(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, k) =>
    k in vars ? String(vars[k]) : m,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>(load);
  const setLang = (l: Lang) => {
    set(l);
    try {
      localStorage.setItem("vv-lang", l);
    } catch {
      /* ignore */
    }
  };
  const t = (key: string, vars?: Vars): string => {
    const template = lang === "en" ? key : (DICT[key]?.[lang] ?? key);
    return fill(template, vars);
  };
  return <C.Provider value={{ lang, setLang, t }}>{children}</C.Provider>;
}
