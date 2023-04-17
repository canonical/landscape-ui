import { FC, useState } from "react";
import classNames from "classnames";
import Navigation from "./Navigation";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

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
        className={classNames("l-navigation", {
          "is-collapsed": menuClosed,
        })}
      >
        <div className="l-navigation__drawer">
          <div className="p-panel is-dark">
            <DesktopHeader closeMenu={() => setMenuClosed(true)} />
            <div className="p-panel__content">
              <Navigation />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Sidebar;
