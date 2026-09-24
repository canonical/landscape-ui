import type { FC, ReactNode } from "react";
import { useId } from "react";
import classNames from "classnames";
import ApplicationIdContext from "@/context/applicationId";
import SidePanelProvider from "@/context/sidePanel";
import classes from "@/templates/dashboard/DashboardTemplate.module.scss";
import SuperAdminSidebar from "./SuperAdminSidebar";

interface SuperAdminTemplateProps {
  readonly children: ReactNode;
  /** Where "Back to normal view" goes. */
  readonly returnTo: string;
}

/** The super admin layout: the dashboard shell with its own sidebar. */
const SuperAdminTemplate: FC<SuperAdminTemplateProps> = ({
  children,
  returnTo,
}) => {
  const applicationId = useId();

  return (
    <div id={applicationId} className="l-application" role="presentation">
      <SidePanelProvider>
        <SuperAdminSidebar returnTo={returnTo} />
        <ApplicationIdContext value={applicationId}>
          <main className={classNames("l-main", classes.wrapper)}>
            <div className={classes.pageContent}>{children}</div>
          </main>
        </ApplicationIdContext>
      </SidePanelProvider>
    </div>
  );
};

export default SuperAdminTemplate;
