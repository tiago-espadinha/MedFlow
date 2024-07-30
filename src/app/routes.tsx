import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Layout from "../components/layout/Layout";
import Resource from "../features/resources/Resource";
import PatientChart from "../features/patients/PatientChart";
import Login from "../features/auth/Login";
import Overview from "../features/overview/Overview";
import Reports from "../features/reports/Reports";
import Settings from "../features/settings/Settings";
import { useAuth } from "../features/auth/AuthProvider";
import { canView } from "../features/auth/permissions";
import type { Key } from "../types/database";

function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const loc = useLocation();
  if (!session)
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}
function RequirePage({
  page,
  children,
}: {
  page: Key | "overview" | "reports" | "settings";
  children: ReactNode;
}) {
  const { session } = useAuth();
  if (!session || !canView(session.role, page))
    return <Navigate to="/" replace />;
  return <>{children}</>;
}
function ResourceGuard() {
  const loc = useLocation();
  const key = loc.pathname.slice(1) as Key;
  return (
    <RequirePage page={key}>
      <Resource />
    </RequirePage>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Overview />} />
        <Route
          path="reports"
          element={
            <RequirePage page="reports">
              <Reports />
            </RequirePage>
          }
        />
        <Route
          path="settings"
          element={
            <RequirePage page="settings">
              <Settings />
            </RequirePage>
          }
        />
        <Route
          path="admissions/:id"
          element={
            <RequirePage page="admissions">
              <PatientChart />
            </RequirePage>
          }
        />
        <Route path=":key" element={<ResourceGuard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
