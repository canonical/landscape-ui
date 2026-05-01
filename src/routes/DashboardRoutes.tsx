import { Outlet, Route } from "react-router";
import { PATHS } from "@/libs/routes";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { FeatureGuard } from "@/components/guards/FeatureGuard";
import * as Pages from "@/routes/elements";
import SecondaryNavigation from "@/templates/dashboard/SecondaryNavigation";
import { ACCOUNT_SETTINGS } from "@/templates/dashboard/SecondaryNavigation/constants";
import DarkModeSwitch from "@/templates/dashboard/SecondaryNavigation/components/DarkModeSwitch";
import { REPOSITORY_SUBMENU } from "@/templates/dashboard/Navigation/constants";
import { SelfHostedGuard } from "@/components/guards/SelfHostedGuard";
import classes from "@/templates/dashboard/DashboardTemplate.module.scss";

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
          path={PATHS.profiles.repositoryProfiles}
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
          path={PATHS.profiles.usg}
          element={
            <FeatureGuard feature="usg-profiles">
              <Pages.USGProfilesPage />
            </FeatureGuard>
          }
        />
      </Route>

      {/* --- Repositories --- */}
      <Route
        path={PATHS.repositories.root}
        element={
          <SelfHostedGuard>
            <div className={classes.wrapper}>
              <SecondaryNavigation
                title="Repositories"
                items={REPOSITORY_SUBMENU}
              />
              <div className={classes.pageContent}>
                <Outlet />
              </div>
            </div>
          </SelfHostedGuard>
        }
      >
        <Route
          path={PATHS.repositories.mirrors}
          element={
            <SelfHostedGuard>
              <Pages.MirrorsPage />
            </SelfHostedGuard>
          }
        />
        <Route
          path={PATHS.repositories.localRepositories}
          element={
            <SelfHostedGuard>
              <Pages.LocalRepositoriesPage />
            </SelfHostedGuard>
          }
        />
        <Route
          path={PATHS.repositories.publications}
          element={
            <SelfHostedGuard>
              <Pages.PublicationsPage />
            </SelfHostedGuard>
          }
        />
        <Route
          path={PATHS.repositories.publicationTargets}
          element={
            <SelfHostedGuard>
              <Pages.PublicationTargetsPage />
            </SelfHostedGuard>
          }
        />
        <Route
          path={PATHS.repositories.repositoryProfiles}
          element={
            <SelfHostedGuard>
              <Pages.RepositoryProfilesPage />
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
      <Route
        path={PATHS.account.root}
        element={
          <>
            <div className={classes.wrapper}>
              <SecondaryNavigation
                title={ACCOUNT_SETTINGS.label}
                items={ACCOUNT_SETTINGS.items}
              >
                <DarkModeSwitch />
              </SecondaryNavigation>
              <div className={classes.pageContent}>
                <Outlet />
              </div>
            </div>
          </>
        }
      >
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
