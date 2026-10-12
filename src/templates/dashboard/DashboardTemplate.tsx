import ApplicationIdContext from "@/context/applicationId";
import WelcomePopup from "@/features/welcome-banner";
import classNames from "classnames";
import { useId, type FC, type ReactNode } from "react";
import SidePanelProvider from "../../context/sidePanel";
import SelfHostedLicenseProvider from "@/context/selfHostedLicense";
import classes from "./DashboardTemplate.module.scss";
import Sidebar from "./Sidebar";

interface DashboardTemplateProps {
  readonly children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  const applicationId = useId();

  return (
    <div id={applicationId} className="l-application" role="presentation">
      <SelfHostedLicenseProvider>
        <ApplicationIdContext value={applicationId}>
          <SidePanelProvider>
            <Sidebar />
            <main className={classNames("l-main", classes.wrapper)}>
              <div className={classes.pageContent}>{children}</div>
            </main>
          </SidePanelProvider>
        </ApplicationIdContext>
      </SelfHostedLicenseProvider>
      <WelcomePopup />
    </div>
  );
};

export default DashboardTemplate;
