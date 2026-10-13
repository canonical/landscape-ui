import InfoItem from "@/components/layout/InfoItem";
import DesktopHeader from "@/templates/dashboard/DesktopHeader";
import MobileHeader from "@/templates/dashboard/MobileHeader";
import sidebarClasses from "@/templates/dashboard/Sidebar.module.scss";
import classNames from "classnames";
import type { FC } from "react";
import { useState } from "react";
import SupportSessionNavigation from "./SupportSessionNavigation";
import classes from "./SupportSessionTemplate.module.scss";
import type { SupportSessionNavItem } from "./types";

interface SupportSessionSidebarProps {
  readonly accountTitle: string;
  readonly navigation: SupportSessionNavItem[];
  /** Where the logo leads: somewhere inside the session, not the dashboard. */
  readonly logoPath: string;
}

const SupportSessionSidebar: FC<SupportSessionSidebarProps> = ({
  accountTitle,
  navigation,
  logoPath,
}) => {
  const [menuClosed, setMenuClosed] = useState(true);

  return (
    <>
      <div className="l-navigation-bar">
        <div className="p-panel is-dark">
          <MobileHeader
            toggleMenu={() => {
              setMenuClosed((prevValue) => !prevValue);
            }}
            logoPath={logoPath}
          />
        </div>
      </div>
      <header
        className={classNames("l-navigation", { "is-collapsed": menuClosed })}
      >
        <div className="l-navigation__drawer">
          <div className="p-panel is-dark">
            <div className={sidebarClasses.container}>
              <DesktopHeader
                closeMenu={() => {
                  setMenuClosed(true);
                }}
                logoPath={logoPath}
              />

              <div className={sidebarClasses.navigation}>
                <InfoItem
                  label="Organization"
                  value={accountTitle}
                  className={classes.organisation}
                />

                <SupportSessionNavigation items={navigation} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default SupportSessionSidebar;
