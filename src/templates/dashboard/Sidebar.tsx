import { FC, useState } from "react";
import classNames from "classnames";
import Navigation from "./Navigation";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import classes from "./Sidebar.module.scss";
import UserInfo from "./UserInfo";
import BetaInfo from "./BetaInfo";
import betaClasses from "./BetaInfo.module.scss";
import desktopHeaderClasses from "./DesktopHeader.module.scss";
import organisationSwitchClasses from "./OrganisationSwitch.module.scss";
import OrganisationSwitch from "./OrganisationSwitch";
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
        className={classNames(
          "l-navigation",
          desktopHeaderClasses.header,
          betaClasses.navigation,
          organisationSwitchClasses.navigation,
          {
            "is-collapsed": menuClosed,
            [betaClasses.menuOpen]: !menuClosed,
            [organisationSwitchClasses.menuOpen]: !menuClosed,
          },
        )}
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
                <BetaInfo />
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
