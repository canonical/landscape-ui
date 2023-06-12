import { FC, useEffect } from "react";
import DashboardTemplate from "../../templates/dashboard";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/repositories", { replace: true });
  }, []);

  return (
    <DashboardTemplate>
      <Outlet />
    </DashboardTemplate>
  );
};

export default DashboardPage;
