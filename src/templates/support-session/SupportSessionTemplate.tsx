import ApplicationIdContext from "@/context/applicationId";
import SidePanelProvider from "@/context/sidePanel";
import classes from "@/templates/dashboard/DashboardTemplate.module.scss";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { useId } from "react";
import SupportSessionSidebar from "./SupportSessionSidebar";
import sessionClasses from "./SupportSessionTemplate.module.scss";

interface SupportSessionTemplateProps {
  readonly children: ReactNode;
  readonly accountName: string;
  readonly accountTitle: string;
  readonly onExit: () => void;
  readonly isExiting?: boolean;
}

/**
 * The dashboard shell for an account entered by Canonical staff: framed, with
 * the account's own navigation and a floating control to leave it.
 */
const SupportSessionTemplate: FC<SupportSessionTemplateProps> = ({
  children,
  accountName,
  accountTitle,
  onExit,
  isExiting = false,
}) => {
  const applicationId = useId();

  return (
    <div id={applicationId} className="l-application" role="presentation">
      <div className={sessionClasses.frame} aria-hidden />
      <SidePanelProvider>
        <SupportSessionSidebar
          accountName={accountName}
          accountTitle={accountTitle}
        />
        <ApplicationIdContext value={applicationId}>
          <main className={classNames("l-main", classes.wrapper)}>
            <div className={classes.pageContent}>{children}</div>
          </main>
        </ApplicationIdContext>
      </SidePanelProvider>
      <div
        role="region"
        aria-label="Support session"
        className={classNames("p-text--small", sessionClasses.bar)}
      >
        <Icon name="security" light aria-hidden />
        <span className={sessionClasses.title}>
          Support session: <strong>{accountTitle}</strong>
        </span>
        <Button
          type="button"
          appearance="base"
          className={classNames("is-dark", sessionClasses.exit)}
          dense
          disabled={isExiting}
          onClick={onExit}
        >
          Exit to super admin
        </Button>
      </div>
    </div>
  );
};

export default SupportSessionTemplate;
