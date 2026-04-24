import ApplicationIdContext from "@/context/applicationId";
import WelcomePopup from "@/features/welcome-banner";
import classNames from "classnames";
import { useId, type FC, type ReactNode } from "react";
import SidePanelProvider from "../../context/sidePanel";
import classes from "./DashboardTemplate.module.scss";
import Sidebar from "./Sidebar";

interface DashboardTemplateProps {
  readonly children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  const applicationId = useId();

  return (
    <div id={applicationId} className="l-application" role="presentation">
      <SidePanelProvider>
        <Sidebar />
        <ApplicationIdContext value={applicationId}>
          <main className={classNames("l-main", classes.wrapper)}>
            <div className={classes.pageContent}>{children}</div>
            {/* {children} */}
          </main>
        </ApplicationIdContext>
      </SidePanelProvider>
      <WelcomePopup />
    </div>
  );
};

export default DashboardTemplate;
