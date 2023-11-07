import { FC, Suspense, useEffect } from "react";
import DashboardTemplate from "../../templates/dashboard";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingState from "../../components/layout/LoadingState";
import { ROOT_PATH } from "../../constants";

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (ROOT_PATH !== pathname) {
      return;
    }

    navigate(`${ROOT_PATH}repositories/mirrors`, { replace: true });
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
