import { Route, Outlet } from "react-router";
import { PATHS } from "@/libs/routes";
import { GuestGuard } from "@/components/guards/GuestGuard";
import { FeatureGuard } from "@/components/guards/FeatureGuard";
import * as Pages from "@/routes/elements";

export const AuthRoutes = (
  <Route
    element={
      <GuestGuard>
        <Outlet />
      </GuestGuard>
    }
  >
    <Route path={PATHS.auth.login} element={<Pages.LoginPage />} />
    <Route path={PATHS.auth.invitation} element={<Pages.InvitationPage />} />
    <Route
      path={PATHS.auth.createAccount}
      element={<Pages.AccountCreationPage />}
    />
    <Route path={PATHS.auth.noAccess} element={<Pages.NoAccessPage />} />
    <Route path={PATHS.auth.handleOidc} element={<Pages.OidcAuthPage />} />
    <Route
      path={PATHS.auth.handleUbuntuOne}
      element={<Pages.UbuntuOneAuthPage />}
    />

    <Route
      path={PATHS.auth.attach}
      element={
        <FeatureGuard feature="employee-management">
          <Pages.AttachPage />
        </FeatureGuard>
      }
    />

    <Route
      path={PATHS.auth.supportLogin}
      element={
        <FeatureGuard feature="support-provider-login">
          <Pages.SupportLoginPage />
        </FeatureGuard>
      }
    />
  </Route>
);
