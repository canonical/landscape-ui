import { FC, useEffect } from "react";
import DashboardTemplate from "../../templates/dashboard";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if ("/" !== pathname) {
      return;
    }

    navigate("/repositories/mirrors", { replace: true });
  }, [pathname]);

  return (
    <DashboardTemplate>
      <Outlet />
    </DashboardTemplate>
  );
};

export default DashboardPage;
