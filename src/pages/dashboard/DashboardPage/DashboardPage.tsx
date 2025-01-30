import type { FC } from "react";
import { Suspense, useEffect } from "react";
import DashboardTemplate from "@/templates/dashboard";
import { Outlet, useLocation, useNavigate } from "react-router";
import LoadingState from "@/components/layout/LoadingState";
import { ROOT_PATH } from "@/constants";
import { maybeRemoveTrailingSlash } from "./helpers";

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      maybeRemoveTrailingSlash(ROOT_PATH) !== maybeRemoveTrailingSlash(pathname)
    ) {
      return;
    }

    navigate(`${ROOT_PATH}overview`, { replace: true });
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
