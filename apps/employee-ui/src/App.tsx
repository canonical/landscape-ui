import { FetchProvider, useAuth } from "@landscape/context";
import { LoadingState } from "@landscape/ui";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { lazy, Suspense, useEffect, type FC } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const InstancesPage = lazy(() => import("@/pages/instances/InstancesPage"));
const SingleInstancePage = lazy(
  () => import("@/pages/instances/[single]/SingleInstanceContainer"),
);

const App: FC = () => {
  interface AuthRouteProps {
    readonly children: ReactNode;
  }

  const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
    const { authorized, authLoading, setUser } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { pathname, search } = useLocation();

    useEffect(() => {
      setUser({
        features: [],
        accounts: [
          {
            classic_dashboard_url: "",
            default: true,
            name: "Test Account",
            subdomain: null,
            title: "Test Account",
          },
        ],
        current_account: "Test Account",
        email: "example@mail.com",
        has_password: true,
        name: "Test User",
        token: "test-account-token",
      });
      return; // TODO change
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

    return <>{children}</>;
    // return authorized ? <>{children}</> : <Redirecting />;
  };

  // const GuestRoute: FC<AuthRouteProps> = ({ children }) => {
  //   const { authorized, authLoading, redirectToExternalUrl } = useAuth();
  //   const navigate = useNavigate();
  //   const [searchParams] = useSearchParams();

  //   useEffect(() => {
  //     if (!authorized || authLoading) {
  //       return;
  //     }

  //     const redirectTo = searchParams.get("redirect-to");

  //     if (!redirectTo) {
  //       navigate(HOMEPAGE_PATH, { replace: true });
  //       return;
  //     }

  //     if (searchParams.has("external")) {
  //       redirectToExternalUrl(redirectTo, { replace: true });
  //     } else {
  //       navigate(redirectTo, { replace: true });
  //     }
  //   }, [authorized, authLoading]);

  //   if (authLoading) {
  //     return <LoadingState />;
  //   }

  //   return !authorized ? <>{children}</> : <Redirecting />;
  // };

  return (
    <FetchProvider>
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
                <Suspense fallback={<LoadingState />}>
                  <Outlet />
                </Suspense>
              }
            >
              <Route path="instances" element={<InstancesPage />} />
              <Route
                path="instances/:instanceId"
                element={<SingleInstancePage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </FetchProvider>
  );
};

export default App;
