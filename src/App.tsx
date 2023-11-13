import { FC, lazy, ReactNode, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import FetchProvider from "./context/fetch";
import useAuth from "./hooks/useAuth";
import DashboardPage from "./pages/dashboard";
import RepositoryPage from "./pages/dashboard/repositories";
import LoadingState from "./components/layout/LoadingState";
import { ROOT_PATH } from "./constants";

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const DistributionsPage = lazy(
  () => import("./pages/dashboard/repositories/mirrors"),
);
const ProfilesPage = lazy(
  () => import("./pages/dashboard/repositories/profiles"),
);
const GPGKeysPage = lazy(
  () => import("./pages/dashboard/repositories/gpg-keys"),
);
const APTSourcesPage = lazy(
  () => import("./pages/dashboard/repositories/apt-sources"),
);
const MachinesPage = lazy(() => import("./pages/dashboard/machines"));
const SingleMachine = lazy(
  () => import("./pages/dashboard/machines/SingleMachine"),
);
const ActivitiesPage = lazy(() => import("./pages/dashboard/activities"));
const ScriptsPage = lazy(() => import("./pages/dashboard/scripts"));
const PackagesPage = lazy(() => import("./pages/dashboard/packages"));

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authorized) {
      navigate(`${ROOT_PATH}login`, { replace: true });
    }
  }, [authorized]);

  return <>{children}</>;
};

const GuestRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authorized) {
      navigate(ROOT_PATH, { replace: true });
    }
  }, [authorized]);

  return <>{children}</>;
};

const App: FC = () => {
  return (
    <FetchProvider>
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
                <ProfilesPage />
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
            path="machines"
            element={
              <AuthRoute>
                <MachinesPage />
              </AuthRoute>
            }
          />
          <Route
            path="machines/:hostname"
            element={
              <AuthRoute>
                <SingleMachine />
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
            path="packages"
            element={
              <AuthRoute>
                <PackagesPage />
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
  );
};

export default App;
