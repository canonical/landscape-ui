import type { FC } from "react";
import { useState } from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router";
import { ActionButton, Icon } from "@canonical/react-components";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import { useAuthHandle } from "@/features/auth";
import { ROUTES } from "@/libs/routes";
import DesktopHeader from "@/templates/dashboard/DesktopHeader";
import MobileHeader from "@/templates/dashboard/MobileHeader";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import sidebarClasses from "@/templates/dashboard/Sidebar.module.scss";
import footerClasses from "@/templates/dashboard/UserInfo/UserInfo.module.scss";
import classes from "./SuperAdminSidebar.module.scss";

interface SuperAdminSidebarProps {
  /** Where "Back to normal view" goes. */
  readonly returnTo: string;
}

const SuperAdminSidebar: FC<SuperAdminSidebarProps> = ({ returnTo }) => {
  const [menuClosed, setMenuClosed] = useState(true);
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { handleLogoutQuery } = useAuthHandle();
  const debug = useDebug();

  const {
    mutateAsync: deleteSessionCookies,
    isPending: isDeletingSessionCookies,
  } = handleLogoutQuery;

  const handleLogout = async () => {
    try {
      await deleteSessionCookies();

      logout();
    } catch (error) {
      debug(error);
    }
  };

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
                      "p-side-navigation__heading p-heading--5 u-no-margin--bottom",
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
                          Back to normal view
                        </span>
                      </Link>
                    </li>
                    <li className="p-side-navigation__item">
                      <ActionButton
                        type="button"
                        appearance="base"
                        className={classNames(
                          "u-no-margin--bottom",
                          footerClasses.link,
                          footerClasses.button,
                        )}
                        onClick={handleLogout}
                        loading={isDeletingSessionCookies}
                      >
                        <Icon
                          name="logout"
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
                          Sign out
                        </span>
                      </ActionButton>
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
