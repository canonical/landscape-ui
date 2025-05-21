import type { FC } from "react";
import { Suspense, useEffect } from "react";
import DashboardTemplate from "@/templates/dashboard";
import { Outlet, useLocation, useNavigate } from "react-router";
import LoadingState from "@/components/layout/LoadingState";
import { ROUTES } from "@/libs/routes";

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (ROUTES.default() !== pathname) {
      return;
    }

    navigate(ROUTES.overview(), { replace: true });
  }, [pathname]);

  return (
    <DashboardTemplate>
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </DashboardTemplate>
  );
};

export default DashboardPage;
