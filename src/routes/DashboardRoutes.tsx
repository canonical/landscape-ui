import { Outlet, Route } from "react-router";
import { PATHS } from "@/libs/routes";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { SelfHostedGuard } from "@/components/guards/SelfHostedGuard";
import { FeatureGuard } from "@/components/guards/FeatureGuard";
import * as Pages from "@/routes/elements";

export const DashboardRoutes = (
  <Route
    element={
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    }
  >
    <Route path={PATHS.root.root} element={<Pages.DashboardPage />}>
      <Route path={PATHS.overview.root} element={<Pages.OverviewPage />} />
      <Route path={PATHS.activities.root} element={<Pages.ActivitiesPage />} />
      <Route path={PATHS.scripts.root} element={<Pages.ScriptsPage />} />
      <Route path={PATHS.eventsLog.root} element={<Pages.EventsLogPage />} />
      <Route
        path={PATHS.alerts.root}
        element={<Pages.AlertNotificationsPage />}
      />
      <Route path={PATHS.error.envError} element={<Pages.EnvError />} />

      {/* --- Instances --- */}
      <Route path={PATHS.instances.root}>
        <Route index element={<Pages.InstancesPage />} />
        <Route path={PATHS.instances.single} element={<Pages.SingleInstance />}>
          <Route path={PATHS.instances.child} />
        </Route>
      </Route>

      {/* --- Profiles --- */}
      <Route path={PATHS.profiles.root}>
        <Route
          path={PATHS.profiles.repository}
          element={<Pages.RepositoryProfilesPage />}
        />
        <Route
          path={PATHS.profiles.package}
          element={<Pages.PackageProfilesPage />}
        />
        <Route
          path={PATHS.profiles.upgrade}
          element={<Pages.UpgradeProfilesPage />}
        />
        <Route
          path={PATHS.profiles.reboot}
          element={<Pages.RebootProfilesPage />}
        />
        <Route
          path={PATHS.profiles.removal}
          element={<Pages.RemovalProfilesPage />}
        />

        <Route
          path={PATHS.profiles.wsl}
          element={
            <FeatureGuard feature="wsl-child-instance-profiles">
              <Pages.WslProfilesPage />
            </FeatureGuard>
          }
        />

        <Route
          path={PATHS.profiles.security}
          element={
            <FeatureGuard feature="usg-profiles">
              <Pages.SecurityProfilesPage />
            </FeatureGuard>
          }
        />
      </Route>

      {/* --- Repositories --- */}
      <Route path={PATHS.repositories.root}>
        <Route
          path={PATHS.repositories.gpgKeys}
          element={<Pages.GPGKeysPage />}
        />
        <Route
          path={PATHS.repositories.aptSources}
          element={<Pages.APTSourcesPage />}
        />

        <Route
          path={PATHS.repositories.mirrors}
          element={
            <SelfHostedGuard>
              <Pages.DistributionsPage />
            </SelfHostedGuard>
          }
        />
      </Route>

      {/* --- Settings --- */}
      <Route path={PATHS.settings.root}>
        <Route
          path={PATHS.settings.general}
          element={<Pages.GeneralOrganisationSettings />}
        />
        <Route
          path={PATHS.settings.administrators}
          element={<Pages.AdministratorsPage />}
        />
        <Route path={PATHS.settings.roles} element={<Pages.RolesPage />} />
        <Route
          path={PATHS.settings.accessGroups}
          element={<Pages.AccessGroupsPage />}
        />

        <Route
          path={PATHS.settings.employees}
          element={
            <FeatureGuard feature="employee-management">
              <Pages.EmployeesPage />
            </FeatureGuard>
          }
        />

        <Route
          path={PATHS.settings.identityProviders}
          element={
            <FeatureGuard feature="oidc-configuration">
              <Pages.IdentityProvidersPage />
            </FeatureGuard>
          }
        />
      </Route>

      {/* --- Account --- */}
      <Route path={PATHS.account.root}>
        <Route
          path={PATHS.account.general}
          element={<Pages.GeneralSettings />}
        />
        <Route path={PATHS.account.alerts} element={<Pages.Alerts />} />
        <Route
          path={PATHS.account.apiCredentials}
          element={<Pages.ApiCredentials />}
        />
      </Route>
    </Route>
  </Route>
);
