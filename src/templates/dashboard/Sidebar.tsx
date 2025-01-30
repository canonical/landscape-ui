import type { FC } from "react";
import { useState } from "react";
import classNames from "classnames";
import Navigation from "./Navigation";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import classes from "./Sidebar.module.scss";
import UserInfo from "./UserInfo";
import OrganisationSwitch from "./OrganisationSwitch";
import LandscapeActions from "@/templates/dashboard/LandscapeActions";

const Sidebar: FC = () => {
  const [menuClosed, setMenuClosed] = useState(true);

  return (
    <>
      <div className="l-navigation-bar">
        <div className="p-panel is-dark">
          <MobileHeader
            toggleMenu={() => setMenuClosed((prevValue) => !prevValue)}
          />
        </div>
      </div>
      <header
        className={classNames("l-navigation", { "is-collapsed": menuClosed })}
      >
        <div className="l-navigation__drawer">
          <div className="p-panel is-dark">
            <div className={classes.container}>
              <DesktopHeader closeMenu={() => setMenuClosed(true)} />
              <div className={classes.navigation}>
                <OrganisationSwitch />
                <Navigation />
              </div>
              <div className={classes.footer}>
                <LandscapeActions />
                <UserInfo />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Sidebar;
