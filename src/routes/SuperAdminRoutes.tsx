import { Navigate, Outlet, Route } from "react-router";
import { PATHS, ROUTES } from "@/libs/routes";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { SuperAdminGuard } from "@/components/guards/SuperAdminGuard";
import * as Pages from "@/routes/elements";

export const SuperAdminRoutes = (
  <Route
    path={PATHS.superAdmin.root}
    element={
      <AuthGuard requireAccount={false}>
        <SuperAdminGuard>
          <Outlet />
        </SuperAdminGuard>
      </AuthGuard>
    }
  >
    {/* The support session has its own shell: the entered account's dashboard. */}
    <Route
      path={PATHS.superAdmin.session}
      element={<Pages.SupportSessionPage />}
    >
      <Route
        index
        element={<Navigate to={PATHS.superAdmin.sessionEventsLog} replace />}
      />
      <Route
        path={PATHS.superAdmin.sessionEventsLog}
        element={<Pages.EventsLogPage />}
      />
    </Route>
    <Route element={<Pages.SuperAdminPage />}>
      <Route
        index
        element={<Navigate to={ROUTES.superAdmin.accounts()} replace />}
      />
      <Route
        path={PATHS.superAdmin.accounts}
        element={<Pages.SuperAdminAccountsPage />}
      />
      <Route
        path={PATHS.superAdmin.account}
        element={<Pages.SuperAdminAccountDetailPage />}
      />
      <Route
        path={PATHS.superAdmin.people}
        element={<Pages.SuperAdminPeoplePage />}
      />
    </Route>
  </Route>
);
