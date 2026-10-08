import InfoItem from "@/components/layout/InfoItem";
import { ROUTES } from "@/libs/routes";
import DesktopHeader from "@/templates/dashboard/DesktopHeader";
import MobileHeader from "@/templates/dashboard/MobileHeader";
import navigationClasses from "@/templates/dashboard/Navigation/Navigation.module.scss";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import sidebarClasses from "@/templates/dashboard/Sidebar.module.scss";
import classNames from "classnames";
import type { FC } from "react";
import { useState } from "react";
import { useLocation } from "react-router";
import classes from "./SupportSessionTemplate.module.scss";

interface SupportSessionSidebarProps {
  readonly accountName: string;
  readonly accountTitle: string;
}

/** Placeholders: profiles and org settings land with the next tickets. */
const PLACEHOLDERS = [
  { label: "Profiles", icon: "cluster" },
  { label: "Org. settings", icon: "settings" },
];

const SupportSessionSidebar: FC<SupportSessionSidebarProps> = ({
  accountName,
  accountTitle,
}) => {
  const [menuClosed, setMenuClosed] = useState(true);
  const { pathname } = useLocation();

  const eventsLogPath = ROUTES.superAdmin.sessionEventsLog(accountName);
  // The logo stays inside the session: the dashboard root would show the
  // entered account without the frame or the way out.
  const sessionPath = ROUTES.superAdmin.session(accountName);

  return (
    <>
      <div className="l-navigation-bar">
        <div className="p-panel is-dark">
          <MobileHeader
            toggleMenu={() => {
              setMenuClosed((prevValue) => !prevValue);
            }}
            logoPath={sessionPath}
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
                logoPath={sessionPath}
              />

              <div className={sidebarClasses.navigation}>
                <InfoItem
                  label="Organization"
                  value={accountTitle}
                  className={classes.organisation}
                />

                <div className="p-side-navigation--icons is-dark">
                  <nav aria-label="Main">
                    <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
                      <li className="p-side-navigation__item">
                        <NavigationRoute
                          item={{
                            label: "Events log",
                            path: eventsLogPath,
                            icon: "status",
                          }}
                          current={pathname === eventsLogPath}
                        />
                      </li>
                      {PLACEHOLDERS.map(({ label, icon }) => (
                        <li key={label} className="p-side-navigation__item">
                          <span
                            className={classNames(
                              "p-side-navigation__link",
                              navigationClasses.link,
                              classes.placeholder,
                            )}
                            aria-disabled="true"
                          >
                            <i
                              className={classNames(
                                `p-icon--${icon} is-light p-side-navigation__icon`,
                                navigationClasses.icon,
                              )}
                            />
                            <span
                              className={classNames(
                                "p-side-navigation__label",
                                navigationClasses.label,
                              )}
                            >
                              {label}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default SupportSessionSidebar;
