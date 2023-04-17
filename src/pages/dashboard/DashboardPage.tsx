import { FC } from "react";
import DashboardTemplate from "../../templates/dashboard";
import { Outlet } from "react-router-dom";

const DashboardPage: FC = () => {
  return (
    <DashboardTemplate>
      <Outlet />
    </DashboardTemplate>
  );
};

export default DashboardPage;
