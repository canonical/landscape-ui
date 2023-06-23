import { FC, ReactNode, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import DashboardPage from "./pages/dashboard";
import PageNotFound from "./pages/PageNotFound";
import DistributionsPage from "./pages/dashboard/repositories/mirrors";
import ProfilesPage from "./pages/dashboard/repositories/profiles";
import GPGKeysPage from "./pages/dashboard/repositories/gpg-keys";
import APTSourcesPage from "./pages/dashboard/repositories/apt-sources";
import FetchProvider from "./context/fetch";
import useAuth from "./hooks/useAuth";
import RepositoryPage from "./pages/dashboard/repositories";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authorized) {
      navigate("/login", { replace: true });
    }
  }, [authorized]);

  return <>{children}</>;
};

const GuestRoute: FC<AuthRouteProps> = ({ children }) => {
  const { authorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authorized) {
      navigate("/", { replace: true });
    }
  }, [authorized]);

  return <>{children}</>;
};

const App: FC = () => {
  return (
    <FetchProvider>
      <Routes>
        <Route
          path="/"
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
        </Route>
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </FetchProvider>
  );
};

export default App;
