import type { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";
import SidePanelProvider from "../../context/sidePanel";
import { matchPath, useLocation } from "react-router";
import SecondaryNavigation from "./SecondaryNavigation";
import classes from "./DashboardTemplate.module.scss";
import classNames from "classnames";
import { useMediaQuery } from "usehooks-ts";
import { ROOT_PATH } from "@/constants";
import WelcomePopup from "@/features/welcome-banner";

interface DashboardTemplateProps {
  readonly children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  const { pathname } = useLocation();
  const hasSecondaryNav = matchPath(`${ROOT_PATH}account/*`, pathname);
  const isLargeScreen = useMediaQuery("(min-width: 620px)");

  return (
    <div className="l-application" role="presentation">
      <SidePanelProvider>
        <Sidebar />
        <main className={classNames("l-main", classes.wrapper)}>
          {hasSecondaryNav && isLargeScreen ? (
            <div
              className={classNames(
                "l-navigation__drawer",
                classes.secondaryNavigation,
              )}
            >
              <SecondaryNavigation />
            </div>
          ) : null}
          <div className={classes.pageContent}>{children}</div>
        </main>
      </SidePanelProvider>
      <WelcomePopup />
    </div>
  );
};

export default DashboardTemplate;
