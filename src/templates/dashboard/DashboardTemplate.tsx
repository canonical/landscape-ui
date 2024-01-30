import { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";
import SidePanelProvider from "../../context/sidePanel";

interface DashboardTemplateProps {
  children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  return (
    <div className="l-application" role="presentation">
      <SidePanelProvider>
        <Sidebar />
        <main className="l-main">{children}</main>
      </SidePanelProvider>
    </div>
  );
};

export default DashboardTemplate;
