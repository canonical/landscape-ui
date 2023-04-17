import { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";

interface DashboardTemplateProps {
  children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  return (
    <div className="l-application" role="presentation">
      <Sidebar />
      {children}
    </div>
  );
};

export default DashboardTemplate;
