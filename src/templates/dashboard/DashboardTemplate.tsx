import { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";
import NotifyProvider from "../../context/notify";
import SidePanelProvider from "../../context/sidePanel";

interface DashboardTemplateProps {
  children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  return (
    <NotifyProvider>
      <div className="l-application" role="presentation">
        <SidePanelProvider>
          <Sidebar />
          <main className="l-main">{children}</main>
        </SidePanelProvider>
      </div>
    </NotifyProvider>
  );
};

export default DashboardTemplate;
