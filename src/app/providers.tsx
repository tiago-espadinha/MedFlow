import type { ReactNode } from "react";
import { I18nProvider } from "../i18n/I18nProvider";
import { AuthProvider } from "../features/auth/AuthProvider";
import { AppProvider } from "../state/AppProvider";

// Order matters: AppProvider translates a couple of its own toast messages, so it must sit
// inside I18nProvider. AuthProvider doesn't depend on either, but sits between the two so
// route guards (which need both auth and app state) can read both from here down.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppProvider>{children}</AppProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
