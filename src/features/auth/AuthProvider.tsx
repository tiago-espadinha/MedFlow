import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role } from "./roles";

interface Session {
  role: Role;
  name: string;
}
interface Ctx {
  session: Session | null;
  login: (role: Role, name: string) => void;
  logout: () => void;
}
const C = createContext<Ctx>(null!);
export const useAuth = () => useContext(C);
function load(): Session | null {
  try {
    const v = localStorage.getItem("vv-session");
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(load);
  const login = (role: Role, name: string) => {
    const s = { role, name };
    setSession(s);
    localStorage.setItem("vv-session", JSON.stringify(s));
  };
  const logout = () => {
    setSession(null);
    localStorage.removeItem("vv-session");
  };
  return <C.Provider value={{ session, login, logout }}>{children}</C.Provider>;
}
