import type { FC } from "react";
import { useState } from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router";
import { Icon } from "@canonical/react-components";
import { ROUTES } from "@/libs/routes";
import DesktopHeader from "@/templates/dashboard/DesktopHeader";
import MobileHeader from "@/templates/dashboard/MobileHeader";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import sidebarClasses from "@/templates/dashboard/Sidebar.module.scss";
import { LogoutButton } from "@/templates/dashboard/UserInfo";
import footerClasses from "@/templates/dashboard/UserInfo/UserInfo.module.scss";
import classes from "./SuperAdminSidebar.module.scss";

interface SuperAdminSidebarProps {
  /** Where "Back to main view" goes. */
  readonly returnTo: string;
}

const SuperAdminSidebar: FC<SuperAdminSidebarProps> = ({ returnTo }) => {
  const [menuClosed, setMenuClosed] = useState(true);
  const { pathname } = useLocation();

  return (
    <>
      <div className="l-navigation-bar">
        <div className="p-panel is-dark">
          <MobileHeader
            toggleMenu={() => {
              setMenuClosed((prevValue) => !prevValue);
            }}
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
              />

              <div
                className={classNames(
                  "p-side-navigation--icons is-dark",
                  sidebarClasses.navigation,
                )}
              >
                <nav aria-label="Super admin">
                  <h3
                    className={classNames(
                      "p-side-navigation__heading p-text--small p-text--small-caps u-no-margin--bottom",
                      classes.heading,
                    )}
                  >
                    Super admin
                  </h3>
                  <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
                    <li className="p-side-navigation__item">
                      <NavigationRoute
                        item={{
                          label: "Accounts",
                          path: ROUTES.superAdmin.accounts(),
                          icon: "user-group",
                        }}
                        current={pathname.startsWith(
                          ROUTES.superAdmin.accounts(),
                        )}
                      />
                    </li>
                    <li className="p-side-navigation__item">
                      <NavigationRoute
                        item={{
                          label: "People",
                          path: ROUTES.superAdmin.people(),
                          icon: "user",
                        }}
                        current={pathname === ROUTES.superAdmin.people()}
                      />
                    </li>
                  </ul>
                </nav>
              </div>

              <div className={sidebarClasses.footer}>
                <div
                  className={classNames(
                    "p-side-navigation--icons is-dark",
                    footerClasses.container,
                  )}
                >
                  <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
                    <li className="p-side-navigation__item">
                      <Link
                        className={classNames(
                          "p-side-navigation__link",
                          footerClasses.link,
                        )}
                        to={returnTo}
                      >
                        <Icon
                          name="chevron-left"
                          className={classNames(
                            "is-light p-side-navigation__icon",
                            footerClasses.icon,
                          )}
                        />
                        <span
                          className={classNames(
                            "p-side-navigation__label",
                            footerClasses.label,
                          )}
                        >
                          Back to main view
                        </span>
                      </Link>
                    </li>
                    <li className="p-side-navigation__item">
                      <LogoutButton />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default SuperAdminSidebar;
