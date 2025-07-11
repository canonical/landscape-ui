import LocalSidePanelProvider from "@/context/localSidePanel";
import WelcomePopup from "@/features/welcome-banner";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { matchPath, useLocation } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import SidePanelProvider from "../../context/sidePanel";
import classes from "./DashboardTemplate.module.scss";
import SecondaryNavigation from "./SecondaryNavigation";
import Sidebar from "./Sidebar";

interface DashboardTemplateProps {
  readonly children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  const { pathname } = useLocation();
  const hasSecondaryNav = matchPath("/account/*", pathname);
  const isLargeScreen = useMediaQuery("(min-width: 620px)");

  return (
    <div className="l-application" role="presentation">
      <SidePanelProvider>
        <LocalSidePanelProvider>
          <Sidebar />
          <main className={classNames("l-main", classes.wrapper)}>
            {hasSecondaryNav && isLargeScreen && (
              <div
                className={classNames(
                  "l-navigation__drawer",
                  classes.secondaryNavigation,
                )}
              >
                <SecondaryNavigation />
              </div>
            )}
            <div className={classes.pageContent}>{children}</div>
          </main>
        </LocalSidePanelProvider>
      </SidePanelProvider>

      <WelcomePopup />
    </div>
  );
};

export default DashboardTemplate;
