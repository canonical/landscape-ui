import AppNotification from "@/components/layout/AppNotification";
import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import FetchProvider from "@/context/fetch";
import FetchOldProvider from "@/context/fetchOld";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import useNotify from "@/hooks/useNotify";
import DashboardPage from "@/pages/dashboard";
import { useQueryClient } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";
import { lazy, Suspense, useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import type { FeatureKey } from "@/types/FeatureKey";
import { ROUTE_PATHS, ROUTES } from "./libs/routes";

const OidcAuthPage = lazy(async () => import("@/pages/auth/handle/oidc"));
const UbuntuOneAuthPage = lazy(
  async () => import("@/pages/auth/handle/ubuntu-one"),
);
const EnvError = lazy(async () => import("@/pages/EnvError"));
const PageNotFound = lazy(async () => import("@/pages/PageNotFound"));
const LoginPage = lazy(async () => import("@/pages/auth/login"));
const DistributionsPage = lazy(
  async () => import("@/pages/dashboard/repositories/mirrors"),
);
const RepositoryPage = lazy(
  async () => import("@/pages/dashboard/repositories"),
);
const RepositoryProfilesPage = lazy(
  async () => import("@/pages/dashboard/profiles/repository-profiles"),
);
const GPGKeysPage = lazy(
  async () => import("@/pages/dashboard/repositories/gpg-keys"),
);
const APTSourcesPage = lazy(
  async () => import("@/pages/dashboard/repositories/apt-sources"),
);
const InstancesPage = lazy(
  async () => import("@/pages/dashboard/instances/InstancesPage"),
);
const SingleInstance = lazy(
  async () => import("@/pages/dashboard/instances/[single]"),
);
const ActivitiesPage = lazy(async () => import("@/pages/dashboard/activities"));
const ScriptsPage = lazy(async () => import("@/pages/dashboard/scripts"));
const ProfilesPage = lazy(async () => import("@/pages/dashboard/profiles"));
const PackageProfilesPage = lazy(
  async () => import("@/pages/dashboard/profiles/package-profiles"),
);
const RemovalProfilesPage = lazy(
  async () => import("@/pages/dashboard/profiles/removal-profiles"),
);
const UpgradeProfilesPage = lazy(
  async () => import("@/pages/dashboard/profiles/upgrade-profiles"),
);
const WslProfilesPage = lazy(
  async () => import("@/pages/dashboard/profiles/wsl-profiles"),
);
const SecurityProfilesPage = lazy(
  async () => import("@/pages/dashboard/profiles/security-profiles"),
);
const RebootProfilesPage = lazy(
  async () => import("@/pages/dashboard/profiles/reboot-profiles"),
);
const SettingsPage = lazy(async () => import("@/pages/dashboard/settings"));
const AccessGroupsPage = lazy(
  async () => import("@/pages/dashboard/settings/access-group"),
);
const AdministratorsPage = lazy(
  async () => import("@/pages/dashboard/settings/administrators"),
);
const EmployeesPage = lazy(
  async () => import("@/pages/dashboard/settings/employees"),
);
const RolesPage = lazy(async () => import("@/pages/dashboard/settings/roles"));
const EventsLogPage = lazy(async () => import("@/pages/dashboard/events-log"));
const AlertNotificationsPage = lazy(
  async () => import("@/pages/dashboard/alert-notifications"),
);
const OverviewPage = lazy(async () => import("@/pages/dashboard/overview"));
const GeneralOrganisationSettings = lazy(
  async () => import("@/pages/dashboard/settings/general"),
);
const AccountPage = lazy(async () => import("@/pages/dashboard/account"));
const GeneralSettings = lazy(
  async () => import("@/pages/dashboard/account/general"),
);
const Alerts = lazy(async () => import("@/pages/dashboard/account/alerts"));
const ApiCredentials = lazy(
  async () => import("@/pages/dashboard/account/api-credentials"),
);
const IdentityProvidersPage = lazy(
  async () => import("@/pages/dashboard/settings/identity-providers"),
);

interface AuthRouteProps {
  readonly children: ReactNode;
}

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized, authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (authorized || authLoading) {
      return;
    }

    const redirectTo = encodeURIComponent(`${pathname}${search}`);

    navigate(ROUTES.login({ "redirect-to": redirectTo }), { replace: true });
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "authUser",
    });
  }, [authorized, authLoading]);

  if (authLoading) {
    return <LoadingState />;
  }

  return authorized ? <>{children}</> : <Redirecting />;
};

const GuestRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized, authLoading, redirectToExternalUrl } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!authorized || authLoading) {
      return;
    }

    const redirectTo = searchParams.get("redirect-to");

    if (!redirectTo) {
      navigate(ROUTES.overview(), { replace: true });
      return;
    }

    if (searchParams.has("external")) {
      redirectToExternalUrl(redirectTo, { replace: true });
    } else {
      navigate(redirectTo, { replace: true });
    }
  }, [authorized, authLoading]);

  if (authLoading) {
    return <LoadingState />;
  }

  return !authorized ? <>{children}</> : <Redirecting />;
};

const SelfHostedRoute: FC<AuthRouteProps> = ({ children }) => {
  const { isSelfHosted, envLoading } = useEnv();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSelfHosted || envLoading) {
      return;
    }

    navigate(ROUTES.envError(), { replace: true });
  }, [isSelfHosted, envLoading]);

  if (envLoading) {
    return <LoadingState />;
  }

  return isSelfHosted ? <>{children}</> : <Redirecting />;
};

interface FeatureRouteProps {
  readonly feature: FeatureKey;
  readonly children: ReactNode;
}

const FeatureRoute: FC<FeatureRouteProps> = ({ feature, children }) => {
  const { isFeatureEnabled } = useAuth();

  return isFeatureEnabled(feature) ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.overview()} replace />
  );
};

const App: FC = () => {
  const { notify, sidePanel } = useNotify();
  const { isOidcAvailable } = useAuth();

  return (
    <FetchOldProvider>
      <FetchProvider>
        {(!sidePanel.open || notify.notification?.type !== "negative") && (
          <AppNotification notify={notify} />
        )}
        <Routes>
          <Route
            element={
              <AuthRoute>
                <Outlet />
              </AuthRoute>
            }
          >
            <Route path={ROUTE_PATHS.root} element={<DashboardPage />}>
              <Route
                element={
                  <SelfHostedRoute>
                    <Suspense fallback={<LoadingState />}>
                      <Outlet />
                    </Suspense>
                  </SelfHostedRoute>
                }
              >
                <Route
                  path={ROUTE_PATHS.repositoriesMirrors}
                  element={<DistributionsPage />}
                />
                <Route
                  path={ROUTE_PATHS.profilesWsl}
                  element={<WslProfilesPage />}
                />
              </Route>
              <Route
                element={
                  <Suspense fallback={<LoadingState />}>
                    <Outlet />
                  </Suspense>
                }
              >
                <Route
                  path={ROUTE_PATHS.repositories}
                  element={<RepositoryPage />}
                />
                <Route
                  path={ROUTE_PATHS.profilesRepository}
                  element={<RepositoryProfilesPage />}
                />
                <Route
                  path={ROUTE_PATHS.repositoriesGpgKeys}
                  element={<GPGKeysPage />}
                />
                <Route
                  path={ROUTE_PATHS.repositoriesAptSources}
                  element={<APTSourcesPage />}
                />
                <Route
                  path={ROUTE_PATHS.instances}
                  element={<InstancesPage />}
                />
                <Route
                  path={ROUTE_PATHS.instancesSingle}
                  element={<SingleInstance />}
                />
                <Route
                  path={ROUTE_PATHS.instancesChild}
                  element={<SingleInstance />}
                />
                <Route
                  path={ROUTE_PATHS.activities}
                  element={<ActivitiesPage />}
                />
                <Route path={ROUTE_PATHS.scripts} element={<ScriptsPage />} />
                <Route
                  path={ROUTE_PATHS.eventsLog}
                  element={<EventsLogPage />}
                />
                <Route path={ROUTE_PATHS.settings} element={<SettingsPage />} />
                <Route
                  path={ROUTE_PATHS.settingsAdministrators}
                  element={<AdministratorsPage />}
                />
                <Route
                  path={ROUTE_PATHS.settingsEmployees}
                  element={
                    <FeatureRoute feature="employee-management">
                      <EmployeesPage />
                    </FeatureRoute>
                  }
                />
                <Route
                  path={ROUTE_PATHS.settingsAccessGroups}
                  element={<AccessGroupsPage />}
                />
                <Route
                  path={ROUTE_PATHS.settingsRoles}
                  element={<RolesPage />}
                />
                <Route
                  path={ROUTE_PATHS.settingsGeneral}
                  element={<GeneralOrganisationSettings />}
                />
                {!isOidcAvailable && (
                  <Route
                    path={ROUTE_PATHS.settingsIdentityProviders}
                    element={
                      <FeatureRoute feature="oidc-configuration">
                        <IdentityProvidersPage />
                      </FeatureRoute>
                    }
                  />
                )}
                <Route path={ROUTE_PATHS.profiles} element={<ProfilesPage />} />
                <Route
                  path={ROUTE_PATHS.profilesPackage}
                  element={<PackageProfilesPage />}
                />
                <Route
                  path={ROUTE_PATHS.profilesRemoval}
                  element={<RemovalProfilesPage />}
                />
                <Route
                  path={ROUTE_PATHS.profilesUpgrade}
                  element={<UpgradeProfilesPage />}
                />
                <Route
                  path={ROUTE_PATHS.profilesSecurity}
                  element={<SecurityProfilesPage />}
                />
                <Route
                  path={ROUTE_PATHS.profilesReboot}
                  element={<RebootProfilesPage />}
                />
                <Route path={ROUTE_PATHS.account} element={<AccountPage />} />
                <Route
                  path={ROUTE_PATHS.accountGeneral}
                  element={<GeneralSettings />}
                />
                <Route path={ROUTE_PATHS.accountAlerts} element={<Alerts />} />
                <Route
                  path={ROUTE_PATHS.accountApiCredentials}
                  element={<ApiCredentials />}
                />
                <Route
                  path={ROUTE_PATHS.alerts}
                  element={<AlertNotificationsPage />}
                />
                <Route path={ROUTE_PATHS.overview} element={<OverviewPage />} />
                <Route path={ROUTE_PATHS.envError} element={<EnvError />} />
              </Route>
            </Route>
          </Route>
          <Route
            element={
              <GuestRoute>
                <Suspense fallback={<LoadingState />}>
                  <Outlet />
                </Suspense>
              </GuestRoute>
            }
          >
            <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
            <Route
              path={ROUTE_PATHS.handleAuthOidc}
              element={<OidcAuthPage />}
            />
            <Route
              path={ROUTE_PATHS.handleAuthUbuntuOne}
              element={<UbuntuOneAuthPage />}
            />
          </Route>
          <Route
            path={ROUTE_PATHS.notFound}
            element={
              <Suspense fallback={<LoadingState />}>
                <PageNotFound />
              </Suspense>
            }
          />
        </Routes>
      </FetchProvider>
    </FetchOldProvider>
  );
};

export default App;
