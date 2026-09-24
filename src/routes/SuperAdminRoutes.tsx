import { Navigate, Route } from "react-router";
import { PATHS, ROUTES } from "@/libs/routes";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { SuperAdminGuard } from "@/components/guards/SuperAdminGuard";
import * as Pages from "@/routes/elements";

export const SuperAdminRoutes = (
  <Route
    path={PATHS.superAdmin.root}
    element={
      <AuthGuard>
        <SuperAdminGuard>
          <Pages.SuperAdminPage />
        </SuperAdminGuard>
      </AuthGuard>
    }
  >
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
);
