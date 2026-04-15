import ApplicationIdContext from "@/context/applicationId";
import WelcomePopup from "@/features/welcome-banner";
import classNames from "classnames";
import { useId, type FC, type ReactNode } from "react";
import { matchPath, useLocation } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import SidePanelProvider from "../../context/sidePanel";
import classes from "./DashboardTemplate.module.scss";
import SecondaryNavigation from "./SecondaryNavigation";
import Sidebar from "./Sidebar";
import { ProfilesProvider } from "@/context/profiles";

interface DashboardTemplateProps {
  readonly children: ReactNode;
}

const DashboardTemplate: FC<DashboardTemplateProps> = ({ children }) => {
  const { pathname } = useLocation();
  const hasSecondaryNav = matchPath("/account/*", pathname);
  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const applicationId = useId();

  return (
    <div id={applicationId} className="l-application" role="presentation">
      <ProfilesProvider key={pathname}>
        <SidePanelProvider>
          <Sidebar />
          <ApplicationIdContext value={applicationId}>
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
          </ApplicationIdContext>
        </SidePanelProvider>
      </ProfilesProvider>
      <WelcomePopup />
    </div>
  );
};

export default DashboardTemplate;
