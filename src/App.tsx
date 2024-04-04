import { FC, lazy, ReactNode, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import FetchProvider from "./context/fetch";
import FetchOldProvider from "./context/fetchOld";
import useAuth from "./hooks/useAuth";
import DashboardPage from "./pages/dashboard";
import RepositoryPage from "./pages/dashboard/repositories";
import LoadingState from "./components/layout/LoadingState";
import { ROOT_PATH } from "./constants";
import AppNotification from "./components/layout/AppNotification";
import useNotify from "./hooks/useNotify";

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const DistributionsPage = lazy(
  () => import("./pages/dashboard/repositories/mirrors"),
);
const RepositoryProfilesPage = lazy(
  () => import("./pages/dashboard/repositories/profiles"),
);
const GPGKeysPage = lazy(
  () => import("./pages/dashboard/repositories/gpg-keys"),
);
const APTSourcesPage = lazy(
  () => import("./pages/dashboard/repositories/apt-sources"),
);
const InstancesPage = lazy(
  () => import("./pages/dashboard/instances/InstancesPage"),
);
const SingleInstance = lazy(
  () => import("@/pages/dashboard/instances/[single]"),
);
const ActivitiesPage = lazy(() => import("./pages/dashboard/activities"));
const ScriptsPage = lazy(() => import("./pages/dashboard/scripts"));
const SavedSearchesPage = lazy(
  () => import("./pages/dashboard/instances/saved-searches"),
);
const AccountPage = lazy(() => import("./pages/dashboard/account"));
const ProfilesPage = lazy(() => import("./pages/dashboard/profiles"));
const PackageProfilesPage = lazy(
  () => import("./pages/dashboard/profiles/package-profiles"),
);
const RemovalProfilesPage = lazy(
  () => import("./pages/dashboard/profiles/removal-profiles"),
);
const UpgradeProfilesPage = lazy(
  () => import("./pages/dashboard/profiles/upgrade-profiles"),
);
const WSLProfilesPage = lazy(
  () => import("./pages/dashboard/profiles/wsl-profiles"),
);
const SettingsPage = lazy(() => import("./pages/dashboard/settings"));
const AccessGroupsPage = lazy(
  () => import("./pages/dashboard/settings/access-group"),
);
const AdministratorsPage = lazy(
  () => import("./pages/dashboard/settings/administrators"),
);
const RolesPage = lazy(() => import("./pages/dashboard/settings/roles"));
const EventLogsPage = lazy(() => import("./pages/dashboard/event-logs"));
const AlertsPage = lazy(() => import("./pages/dashboard/settings/alerts"));
const UserPage = lazy(() => import("./pages/dashboard/user"));
const AlertNotificationsPage = lazy(
  () => import("./pages/dashboard/alert-notifications"),
);
const OverviewPage = lazy(() => import("./pages/dashboard/overview"));

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authorized || authLoading) {
      return;
    }

    navigate(`${ROOT_PATH}login`, { replace: true });
  }, [authorized, authLoading]);

  return <>{children}</>;
};

const GuestRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authorized || authLoading) {
      return;
    }

    navigate(ROOT_PATH, { replace: true });
  }, [authorized, authLoading]);

  return <>{children}</>;
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
            path={ROOT_PATH}
            element={
              <AuthRoute>
                <DashboardPage />
              </AuthRoute>
            }
          >
            <Route
              path="repositories"
              element={
                <AuthRoute>
                  <RepositoryPage />
                </AuthRoute>
              }
            />
            <Route
              path="repositories/mirrors"
              element={
                <AuthRoute>
                  <DistributionsPage />
                </AuthRoute>
              }
            />
            <Route
              path="repositories/profiles"
              element={
                <AuthRoute>
                  <RepositoryProfilesPage />
                </AuthRoute>
              }
            />
            <Route
              path="repositories/gpg-keys"
              element={
                <AuthRoute>
                  <GPGKeysPage />
                </AuthRoute>
              }
            />
            <Route
              path="repositories/apt-sources"
              element={
                <AuthRoute>
                  <APTSourcesPage />
                </AuthRoute>
              }
            />
            <Route
              path="instances"
              element={
                <AuthRoute>
                  <InstancesPage />
                </AuthRoute>
              }
            />
            <Route
              path="instances/:hostname"
              element={
                <AuthRoute>
                  <SingleInstance />
                </AuthRoute>
              }
            />
            <Route
              path="instances/:hostname/:childHostname"
              element={
                <AuthRoute>
                  <SingleInstance />
                </AuthRoute>
              }
            />
            <Route
              path="instances/searches"
              element={
                <AuthRoute>
                  <SavedSearchesPage />
                </AuthRoute>
              }
            />
            <Route
              path="activities"
              element={
                <AuthRoute>
                  <ActivitiesPage />
                </AuthRoute>
              }
            />
            <Route
              path="scripts"
              element={
                <AuthRoute>
                  <ScriptsPage />
                </AuthRoute>
              }
            />
            <Route
              path="account"
              element={
                <AuthRoute>
                  <AccountPage />
                </AuthRoute>
              }
            />
            <Route
              path="event-logs"
              element={
                <AuthRoute>
                  <EventLogsPage />
                </AuthRoute>
              }
            />
            <Route
              path="settings/alerts"
              element={
                <AuthRoute>
                  <AlertsPage />
                </AuthRoute>
              }
            />
            <Route
              path="settings"
              element={
                <AuthRoute>
                  <SettingsPage />
                </AuthRoute>
              }
            />
            <Route
              path="settings/administrators"
              element={
                <AuthRoute>
                  <AdministratorsPage />
                </AuthRoute>
              }
            />
            <Route
              path="settings/access-groups"
              element={
                <AuthRoute>
                  <AccessGroupsPage />
                </AuthRoute>
              }
            />
            <Route
              path="settings/roles"
              element={
                <AuthRoute>
                  <RolesPage />
                </AuthRoute>
              }
            />
            <Route
              path="profiles"
              element={
                <AuthRoute>
                  <ProfilesPage />
                </AuthRoute>
              }
            />
            <Route
              path="profiles/package"
              element={
                <AuthRoute>
                  <PackageProfilesPage />
                </AuthRoute>
              }
            />
            <Route
              path="profiles/removal"
              element={
                <AuthRoute>
                  <RemovalProfilesPage />
                </AuthRoute>
              }
            />
            <Route
              path="profiles/upgrade"
              element={
                <AuthRoute>
                  <UpgradeProfilesPage />
                </AuthRoute>
              }
            />
            <Route
              path="profiles/wsl"
              element={
                <AuthRoute>
                  <WSLProfilesPage />
                </AuthRoute>
              }
            />
            <Route
              path="user"
              element={
                <AuthRoute>
                  <UserPage />
                </AuthRoute>
              }
            />
            <Route
              path="alerts"
              element={
                <AuthRoute>
                  <AlertNotificationsPage />
                </AuthRoute>
              }
            />
            <Route
              path="overview"
              element={
                <AuthRoute>
                  <OverviewPage />
                </AuthRoute>
              }
            />
          </Route>
          <Route
            path={`${ROOT_PATH}login`}
            element={
              <GuestRoute>
                <Suspense fallback={<LoadingState />}>
                  <LoginPage />
                </Suspense>
              </GuestRoute>
            }
          />
          <Route
            path={`${ROOT_PATH}*`}
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
