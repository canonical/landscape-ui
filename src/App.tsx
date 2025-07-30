import AppNotification from "@/components/layout/AppNotification";
import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import { HOMEPAGE_PATH } from "@/constants";
import FetchProvider from "@/context/fetch";
import FetchOldProvider from "@/context/fetchOld";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import useNotify from "@/hooks/useNotify";
import DashboardPage from "@/pages/dashboard";
import type { FeatureKey } from "@/types/FeatureKey";
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

const OidcAuthPage = lazy(async () => import("@/pages/auth/handle/oidc"));
const UbuntuOneAuthPage = lazy(
  async () => import("@/pages/auth/handle/ubuntu-one"),
);
const EnvError = lazy(async () => import("@/pages/EnvError"));
const PageNotFound = lazy(async () => import("@/pages/PageNotFound"));
const LoginPage = lazy(async () => import("@/pages/auth/login"));
const SupportLoginPage = lazy(async () => import("@/pages/auth/support-login"));
const DistributionsPage = lazy(
  async () => import("@/pages/dashboard/repositories/mirrors"),
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
  const { authorized, authLoading, redirectToExternalUrl } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!authorized || authLoading) {
      return;
    }

    const redirectTo = searchParams.get("redirect-to");

    if (!redirectTo) {
      navigate(HOMEPAGE_PATH, { replace: true });
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

    navigate("/env-error", { replace: true });
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
    <Navigate to={HOMEPAGE_PATH} replace />
  );
};

const App: FC = () => {
  const { notify, sidePanel } = useNotify();

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
            <Route element={<DashboardPage />}>
              <Route
                path="overview"
                element={
                  <Suspense key="overview" fallback={<LoadingState />}>
                    <OverviewPage />
                  </Suspense>
                }
              />
              <Route path="instances">
                <Route
                  index
                  element={
                    <Suspense key="instances" fallback={<LoadingState />}>
                      <InstancesPage />
                    </Suspense>
                  }
                />
                <Route
                  path=":instanceId"
                  element={
                    <Suspense
                      key="instances/instance"
                      fallback={<LoadingState />}
                    >
                      <SingleInstance />
                    </Suspense>
                  }
                >
                  <Route path=":childInstanceId" />
                </Route>
              </Route>
              <Route
                path="activities"
                element={
                  <Suspense key="activities" fallback={<LoadingState />}>
                    <ActivitiesPage />
                  </Suspense>
                }
              />
              <Route
                path="scripts"
                element={
                  <Suspense key="scripts" fallback={<LoadingState />}>
                    <ScriptsPage />
                  </Suspense>
                }
              />
              <Route
                path="events-log"
                element={
                  <Suspense key="events-log" fallback={<LoadingState />}>
                    <EventsLogPage />
                  </Suspense>
                }
              />
              <Route path="profiles">
                <Route
                  path="repository"
                  element={
                    <Suspense
                      key="profiles/repository"
                      fallback={<LoadingState />}
                    >
                      <RepositoryProfilesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="package"
                  element={
                    <Suspense
                      key="profiles/package"
                      fallback={<LoadingState />}
                    >
                      <PackageProfilesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="upgrade"
                  element={
                    <Suspense
                      key="profiles/upgrade"
                      fallback={<LoadingState />}
                    >
                      <UpgradeProfilesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="reboot"
                  element={
                    <Suspense key="profiles/reboot" fallback={<LoadingState />}>
                      <RebootProfilesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="removal"
                  element={
                    <Suspense
                      key="profiles/removal"
                      fallback={<LoadingState />}
                    >
                      <RemovalProfilesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="wsl"
                  element={
                    <SelfHostedRoute>
                      <Suspense key="profiles/wsl" fallback={<LoadingState />}>
                        <WslProfilesPage />
                      </Suspense>
                    </SelfHostedRoute>
                  }
                />
                <Route
                  path="security"
                  element={
                    <FeatureRoute feature="usg-profiles">
                      <Suspense
                        key="profiles/security"
                        fallback={<LoadingState />}
                      >
                        <SecurityProfilesPage />
                      </Suspense>
                    </FeatureRoute>
                  }
                />
              </Route>
              <Route path="repositories">
                <Route
                  path="mirrors"
                  element={
                    <SelfHostedRoute>
                      <Suspense
                        key="repositories/mirrors"
                        fallback={<LoadingState />}
                      >
                        <DistributionsPage />
                      </Suspense>
                    </SelfHostedRoute>
                  }
                />

                <Route
                  path="gpg-keys"
                  element={
                    <Suspense
                      key="repositories/gpg-keys"
                      fallback={<LoadingState />}
                    >
                      <GPGKeysPage />
                    </Suspense>
                  }
                />
                <Route
                  path="apt-sources"
                  element={
                    <Suspense
                      key="repositories/apt-sources"
                      fallback={<LoadingState />}
                    >
                      <APTSourcesPage />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="settings">
                <Route
                  path="general"
                  element={
                    <Suspense
                      key="settings/general"
                      fallback={<LoadingState />}
                    >
                      <GeneralOrganisationSettings />
                    </Suspense>
                  }
                />
                <Route
                  path="administrators"
                  element={
                    <Suspense
                      key="settings/administrators"
                      fallback={<LoadingState />}
                    >
                      <AdministratorsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="employees"
                  element={
                    <FeatureRoute feature="employee-management">
                      <Suspense
                        key="settings/employees"
                        fallback={<LoadingState />}
                      >
                        <EmployeesPage />
                      </Suspense>
                    </FeatureRoute>
                  }
                />
                <Route
                  path="roles"
                  element={
                    <Suspense key="settings/roles" fallback={<LoadingState />}>
                      <RolesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="access-groups"
                  element={
                    <Suspense
                      key="settings/access-groups"
                      fallback={<LoadingState />}
                    >
                      <AccessGroupsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="identity-providers"
                  element={
                    <FeatureRoute feature="oidc-configuration">
                      <Suspense
                        key="settings/identity-providers"
                        fallback={<LoadingState />}
                      >
                        <IdentityProvidersPage />
                      </Suspense>
                    </FeatureRoute>
                  }
                />
              </Route>
              <Route path="account">
                <Route
                  path="general"
                  element={
                    <Suspense key="account/general" fallback={<LoadingState />}>
                      <GeneralSettings />
                    </Suspense>
                  }
                />
                <Route
                  path="alerts"
                  element={
                    <Suspense key="account/alerts" fallback={<LoadingState />}>
                      <Alerts />
                    </Suspense>
                  }
                />
                <Route
                  path="api-credentials"
                  element={
                    <Suspense
                      key="account/api-credentials"
                      fallback={<LoadingState />}
                    >
                      <ApiCredentials />
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path="alerts"
                element={
                  <Suspense key="alerts" fallback={<LoadingState />}>
                    <AlertNotificationsPage />
                  </Suspense>
                }
              />
              <Route
                path="env-error"
                element={
                  <Suspense key="env-error" fallback={<LoadingState />}>
                    <EnvError />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route
            element={
              <GuestRoute>
                <Outlet />
              </GuestRoute>
            }
          >
            <Route
              path={"/login"}
              element={
                <Suspense key="/login" fallback={<LoadingState />}>
                  <LoginPage />
                </Suspense>
              }
            />
            <Route
              path={"/support/login"}
              element={
                <FeatureRoute feature="support-provider-login">
                  <Suspense key="/support/login" fallback={<LoadingState />}>
                    <SupportLoginPage />
                  </Suspense>
                </FeatureRoute>
              }
            />

            <Route
              path={"/handle-auth/oidc"}
              element={
                <Suspense key="/handle-auth/oidc" fallback={<LoadingState />}>
                  <OidcAuthPage />
                </Suspense>
              }
            />
            <Route
              path={"/handle-auth/ubuntu-one"}
              element={
                <Suspense
                  key="/handle-auth/ubuntu-one"
                  fallback={<LoadingState />}
                >
                  <UbuntuOneAuthPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path={"/*"}
            element={
              <Suspense key="*" fallback={<LoadingState />}>
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
