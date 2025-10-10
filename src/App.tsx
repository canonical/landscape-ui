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
import { PATHS, ROUTES } from "./libs/routes";

const OidcAuthPage = lazy(async () => import("@/pages/auth/handle/oidc"));
const UbuntuOneAuthPage = lazy(
  async () => import("@/pages/auth/handle/ubuntu-one"),
);
const InvitationPage = lazy(async () => import("@/pages/auth/invitation"));
const AccountCreationPage = lazy(
  async () => import("@/pages/auth/account-creation"),
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
const AttachPage = lazy(async () => import("@/pages/auth/attach/AttachPage"));

interface AuthRouteProps {
  readonly children: ReactNode;
}

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized, authLoading, hasAccounts } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!authorized) {
      const redirectTo = `${pathname}${search}`;
      navigate(ROUTES.auth.login({ "redirect-to": redirectTo }), {
        replace: true,
      });
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "authUser",
      });
      return;
    }

    if (!hasAccounts) {
      navigate(ROUTES.auth.createAccount(), { replace: true });
    }
  }, [
    authorized,
    authLoading,
    hasAccounts,
    pathname,
    search,
    navigate,
    queryClient,
  ]);

  if (authLoading) {
    return <LoadingState />;
  }

  return authorized && hasAccounts ? <>{children}</> : <Redirecting />;
};

const GuestRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized, authLoading, hasAccounts, redirectToExternalUrl } =
    useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!authorized || authLoading) {
      return;
    }

    if (!hasAccounts) {
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
  }, [
    authorized,
    authLoading,
    hasAccounts,
    searchParams,
    navigate,
    redirectToExternalUrl,
  ]);

  if (authLoading) {
    return <LoadingState />;
  }

  return !authorized || !hasAccounts ? <>{children}</> : <Redirecting />;
};

const SelfHostedRoute: FC<AuthRouteProps> = ({ children }) => {
  const { isSelfHosted, envLoading } = useEnv();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSelfHosted || envLoading) {
      return;
    }

    navigate(ROUTES.errors.envError(), { replace: true });
  }, [isSelfHosted, envLoading, navigate]);

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
            <Route path={PATHS.root.root} element={<DashboardPage />}>
              <Route
                path={PATHS.overview.root}
                element={
                  <Suspense key="overview" fallback={<LoadingState />}>
                    <OverviewPage />
                  </Suspense>
                }
              />
              <Route path={PATHS.instances.root}>
                <Route
                  index
                  element={
                    <Suspense key="instances" fallback={<LoadingState />}>
                      <InstancesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={PATHS.instances.single}
                  element={
                    <Suspense
                      key="instances/instance"
                      fallback={<LoadingState />}
                    >
                      <SingleInstance />
                    </Suspense>
                  }
                >
                  <Route path={PATHS.instances.child} />
                </Route>
              </Route>
              <Route
                path={PATHS.activities.root}
                element={
                  <Suspense key="activities" fallback={<LoadingState />}>
                    <ActivitiesPage />
                  </Suspense>
                }
              />
              <Route
                path={PATHS.scripts.root}
                element={
                  <Suspense key="scripts" fallback={<LoadingState />}>
                    <ScriptsPage />
                  </Suspense>
                }
              />
              <Route
                path={PATHS.eventsLog.root}
                element={
                  <Suspense key="events-log" fallback={<LoadingState />}>
                    <EventsLogPage />
                  </Suspense>
                }
              />
              <Route path={PATHS.profiles.root}>
                <Route
                  path={PATHS.profiles.repository}
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
                  path={PATHS.profiles.package}
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
                  path={PATHS.profiles.upgrade}
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
                  path={PATHS.profiles.reboot}
                  element={
                    <Suspense key="profiles/reboot" fallback={<LoadingState />}>
                      <RebootProfilesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={PATHS.profiles.removal}
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
                  path={PATHS.profiles.wsl}
                  element={
                    <FeatureRoute feature="wsl-child-instance-profiles">
                      <Suspense key="profiles/wsl" fallback={<LoadingState />}>
                        <WslProfilesPage />
                      </Suspense>
                    </FeatureRoute>
                  }
                />
                <Route
                  path={PATHS.profiles.security}
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
              <Route path={PATHS.repositories.root}>
                <Route
                  path={PATHS.repositories.mirrors}
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
                  path={PATHS.repositories.gpgKeys}
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
                  path={PATHS.repositories.aptSources}
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
              <Route path={PATHS.settings.root}>
                <Route
                  path={PATHS.settings.general}
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
                  path={PATHS.settings.administrators}
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
                  path={PATHS.settings.employees}
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
                  path={PATHS.settings.roles}
                  element={
                    <Suspense key="settings/roles" fallback={<LoadingState />}>
                      <RolesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={PATHS.settings.accessGroups}
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
                  path={PATHS.settings.identityProviders}
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
              <Route path={PATHS.account.root}>
                <Route
                  path={PATHS.account.general}
                  element={
                    <Suspense key="account/general" fallback={<LoadingState />}>
                      <GeneralSettings />
                    </Suspense>
                  }
                />
                <Route
                  path={PATHS.account.alerts}
                  element={
                    <Suspense key="account/alerts" fallback={<LoadingState />}>
                      <Alerts />
                    </Suspense>
                  }
                />
                <Route
                  path={PATHS.account.apiCredentials}
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
                path={PATHS.alerts.root}
                element={
                  <Suspense key="alerts" fallback={<LoadingState />}>
                    <AlertNotificationsPage />
                  </Suspense>
                }
              />
              <Route
                path={PATHS.error.envError}
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
              path={PATHS.auth.attach}
              element={
                <FeatureRoute feature="employee-management">
                  <AttachPage />
                </FeatureRoute>
              }
            />
            <Route path={PATHS.auth.login} element={<LoginPage />} />
            <Route
              path={PATHS.auth.invitation}
              element={
                <Suspense key="/accept-invitation" fallback={<LoadingState />}>
                  <InvitationPage />
                </Suspense>
              }
            />
            <Route
              path={PATHS.auth.createAccount}
              element={
                <Suspense key="/create-account" fallback={<LoadingState />}>
                  <AccountCreationPage />
                </Suspense>
              }
            />
            <Route
              path={PATHS.auth.supportLogin}
              element={
                <FeatureRoute feature="support-provider-login">
                  <Suspense key="/support/login" fallback={<LoadingState />}>
                    <SupportLoginPage />
                  </Suspense>
                </FeatureRoute>
              }
            />

            <Route
              path={PATHS.auth.handleOidc}
              element={
                <Suspense key="/handle-auth/oidc" fallback={<LoadingState />}>
                  <OidcAuthPage />
                </Suspense>
              }
            />
            <Route
              path={PATHS.auth.handleUbuntuOne}
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
            path={PATHS.root.notFound}
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
