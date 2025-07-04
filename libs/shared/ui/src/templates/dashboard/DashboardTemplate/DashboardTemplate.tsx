import type { FC, ReactNode } from "react";
import Sidebar from "../Sidebar";
import { matchPath, useLocation } from "react-router";
import SecondaryNavigation from "../SecondaryNavigation";
import classes from "./DashboardTemplate.module.scss";
import classNames from "classnames";
import { useMediaQuery } from "usehooks-ts";
import { SidePanelProvider } from "@landscape/context";
import { MenuItem } from "../Navigation/types";

interface DashboardTemplateProps {
  readonly children: ReactNode;
  readonly menuItems: MenuItem[]; // TODO CHANGE
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({
  children,
  menuItems,
}) => {
  const { pathname } = useLocation();
  const hasSecondaryNav = matchPath("/account/*", pathname);
  const isLargeScreen = useMediaQuery("(min-width: 620px)");

  return (
    <div className="l-application" role="presentation">
      <SidePanelProvider>
        <Sidebar menuItems={menuItems} />
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
      </SidePanelProvider>
      {/* <WelcomePopup /> */}
    </div>
  );
};

export default DashboardTemplate;
