import type { FC, ReactNode } from "react";
import { lazy, Suspense, useEffect } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import AppNotification from "@/components/layout/AppNotification";
import LoadingState from "@/components/layout/LoadingState";
import FetchProvider from "@/context/fetch";
import FetchOldProvider from "@/context/fetchOld";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import useNotify from "@/hooks/useNotify";
import DashboardPage from "@/pages/dashboard";
import Redirecting from "@/components/layout/Redirecting";

const OidcAuthPage = lazy(() => import("@/pages/auth/handle/oidc"));
const UbuntuOneAuthPage = lazy(() => import("@/pages/auth/handle/ubuntu-one"));
const EnvError = lazy(() => import("@/pages/EnvError"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));
const LoginPage = lazy(() => import("@/pages/auth/login"));
const DistributionsPage = lazy(
  () => import("@/pages/dashboard/repositories/mirrors"),
);
const RepositoryPage = lazy(() => import("@/pages/dashboard/repositories"));
const RepositoryProfilesPage = lazy(
  () => import("@/pages/dashboard/profiles/repository-profiles"),
);
const GPGKeysPage = lazy(
  () => import("@/pages/dashboard/repositories/gpg-keys"),
);
const APTSourcesPage = lazy(
  () => import("@/pages/dashboard/repositories/apt-sources"),
);
const InstancesPage = lazy(
  () => import("@/pages/dashboard/instances/InstancesPage"),
);
const SingleInstance = lazy(
  () => import("@/pages/dashboard/instances/[single]"),
);
const ActivitiesPage = lazy(() => import("@/pages/dashboard/activities"));
const ScriptsPage = lazy(() => import("@/pages/dashboard/scripts"));
const ProfilesPage = lazy(() => import("@/pages/dashboard/profiles"));
const PackageProfilesPage = lazy(
  () => import("@/pages/dashboard/profiles/package-profiles"),
);
const RemovalProfilesPage = lazy(
  () => import("@/pages/dashboard/profiles/removal-profiles"),
);
const UpgradeProfilesPage = lazy(
  () => import("@/pages/dashboard/profiles/upgrade-profiles"),
);
const WslProfilesPage = lazy(
  () => import("@/pages/dashboard/profiles/wsl-profiles"),
);
const SettingsPage = lazy(() => import("@/pages/dashboard/settings"));
const AccessGroupsPage = lazy(
  () => import("@/pages/dashboard/settings/access-group"),
);
const AdministratorsPage = lazy(
  () => import("@/pages/dashboard/settings/administrators"),
);
const EmployeesPage = lazy(
  () => import("@/pages/dashboard/settings/employees"),
);
const RolesPage = lazy(() => import("@/pages/dashboard/settings/roles"));
const EventsLogPage = lazy(() => import("@/pages/dashboard/events-log"));
const AlertNotificationsPage = lazy(
  () => import("@/pages/dashboard/alert-notifications"),
);
const OverviewPage = lazy(() => import("@/pages/dashboard/overview"));
const GeneralOrganisationSettings = lazy(
  () => import("@/pages/dashboard/settings/general"),
);
const AccountPage = lazy(() => import("@/pages/dashboard/account"));
const GeneralSettings = lazy(() => import("@/pages/dashboard/account/general"));
const Alerts = lazy(() => import("@/pages/dashboard/account/alerts"));
const ApiCredentials = lazy(
  () => import("@/pages/dashboard/account/api-credentials"),
);
const IdentityProvidersPage = lazy(
  () => import("@/pages/dashboard/settings/identity-providers"),
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

    navigate(`login?redirect-to=${redirectTo}`, {
      replace: true,
    });
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
  const { authorized, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authorized || authLoading) {
      return;
    }

    navigate("/", { replace: true });
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

    navigate("/env-error", { replace: true });
  }, [isSelfHosted, envLoading]);

  if (envLoading) {
    return <LoadingState />;
  }

  return isSelfHosted ? <>{children}</> : <Redirecting />;
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
            <Route path="/" element={<DashboardPage />}>
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
                  path="repositories/mirrors"
                  element={<DistributionsPage />}
                />
                <Route path="profiles/wsl" element={<WslProfilesPage />} />
              </Route>
              <Route
                element={
                  <Suspense fallback={<LoadingState />}>
                    <Outlet />
                  </Suspense>
                }
              >
                <Route path="repositories" element={<RepositoryPage />} />
                <Route
                  path="profiles/repositories"
                  element={<RepositoryProfilesPage />}
                />
                <Route path="repositories/gpg-keys" element={<GPGKeysPage />} />
                <Route
                  path="repositories/apt-sources"
                  element={<APTSourcesPage />}
                />
                <Route path="instances" element={<InstancesPage />} />
                <Route
                  path="instances/:instanceId"
                  element={<SingleInstance />}
                />
                <Route
                  path="instances/:instanceId/:childInstanceId"
                  element={<SingleInstance />}
                />
                <Route path="activities" element={<ActivitiesPage />} />
                <Route path="scripts" element={<ScriptsPage />} />
                <Route path="events-log" element={<EventsLogPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route
                  path="settings/administrators"
                  element={<AdministratorsPage />}
                />
                <Route path="settings/employees" element={<EmployeesPage />} />
                <Route
                  path="settings/access-groups"
                  element={<AccessGroupsPage />}
                />
                <Route path="settings/roles" element={<RolesPage />} />
                <Route
                  path="settings/general"
                  element={<GeneralOrganisationSettings />}
                />
                {isOidcAvailable && (
                  <Route
                    path="settings/identity-providers"
                    element={<IdentityProvidersPage />}
                  />
                )}
                <Route path="profiles" element={<ProfilesPage />} />
                <Route
                  path="profiles/package"
                  element={<PackageProfilesPage />}
                />
                <Route
                  path="profiles/removal"
                  element={<RemovalProfilesPage />}
                />
                <Route
                  path="profiles/upgrade"
                  element={<UpgradeProfilesPage />}
                />
                <Route path="account" element={<AccountPage />} />
                <Route path="account/general" element={<GeneralSettings />} />
                <Route path="account/alerts" element={<Alerts />} />
                <Route
                  path="account/api-credentials"
                  element={<ApiCredentials />}
                />
                <Route path="alerts" element={<AlertNotificationsPage />} />
                <Route path="overview" element={<OverviewPage />} />
                <Route path="env-error" element={<EnvError />} />
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
            <Route path={"/login"} element={<LoginPage />} />
            <Route path={"/handle-auth/oidc"} element={<OidcAuthPage />} />
            <Route
              path={"/handle-auth/ubuntu-one"}
              element={<UbuntuOneAuthPage />}
            />
          </Route>
          <Route
            path={"/*"}
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
