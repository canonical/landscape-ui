import type { FC } from "react";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Button, Icon } from "@canonical/react-components";
import classes from "./UserInfo.module.scss";
import classNames from "classnames";
import { Link, useLocation } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import { ACCOUNT_SETTINGS } from "../SecondaryNavigation/constants";
import { useAuthHandle } from "@/features/auth";
import useDebug from "@/hooks/useDebug";
import { ROUTES } from "@/libs/routes";

const UserInfo: FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isSmallerScreen = useMediaQuery("(max-width: 619px)");
  const { handleLogoutQuery } = useAuthHandle();
  const debug = useDebug();

  const [expandedAccountSettings, setExpandedAccountSettings] = useState(false);

  const { mutateAsync: deleteSessionCookies } = handleLogoutQuery;

  const handleLogout = async () => {
    try {
      await deleteSessionCookies();

      logout();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div
      className={classNames(
        "p-side-navigation--icons is-dark",
        classes.container,
      )}
    >
      <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
        <li className="p-side-navigation__item">
          {isSmallerScreen && (
            <>
              <Button
                className={classNames(
                  "p-side-navigation__accordion-button",
                  classes.accordionButton,
                )}
                type="button"
                aria-expanded={expandedAccountSettings}
                onClick={() => {
                  setExpandedAccountSettings((prevState) => !prevState);
                }}
              >
                <Icon
                  name="account"
                  className={classNames(
                    "is-light p-side-navigation__icon",
                    classes.icon,
                  )}
                />
                <span
                  className={classNames(
                    "p-side-navigation__label",
                    classes.label,
                  )}
                >
                  {user?.name ?? "Unknown user"}
                </span>
              </Button>
              <ul
                className="p-side-navigation__list"
                aria-expanded={expandedAccountSettings}
              >
                {ACCOUNT_SETTINGS.items?.map((accountSettingItem) => (
                  <li key={accountSettingItem.path}>
                    <Link
                      className={classNames(
                        "p-side-navigation__link",
                        classes.link,
                      )}
                      to={accountSettingItem.path}
                      aria-current={
                        pathname === accountSettingItem.path
                          ? "page"
                          : undefined
                      }
                    >
                      <span
                        className={classNames(
                          "p-side-navigation__label",
                          classes.label,
                        )}
                      >
                        {accountSettingItem.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!isSmallerScreen && (
            <Link
              to={ROUTES.accountGeneral()}
              className={classNames(
                "p-side-navigation__link",
                classes.accordionButton,
              )}
              aria-expanded={false}
              aria-current={
                pathname.includes(ROUTES.account()) ? "page" : undefined
              }
            >
              <Icon
                name="account"
                className={classNames(
                  "is-light p-side-navigation__icon",
                  classes.icon,
                )}
              />
              <span
                className={classNames(
                  "p-side-navigation__label",
                  classes.label,
                )}
              >
                {user?.name ?? "Unknown user"}
              </span>
            </Link>
          )}
        </li>
        <li className="p-side-navigation__item">
          <Link
            className={classNames("p-side-navigation__link", classes.link)}
            to={ROUTES.alerts()}
            aria-current={pathname === ROUTES.alerts() ? "page" : undefined}
          >
            <Icon
              name="bell"
              className={classNames(
                "is-light p-side-navigation__icon",
                classes.icon,
              )}
            />
            <span
              className={classNames("p-side-navigation__label", classes.label)}
            >
              Alerts
            </span>
          </Link>
        </li>
        <li className="p-side-navigation__item">
          <Button
            type="button"
            appearance="base"
            className={classNames(
              "u-no-margin--bottom",
              classes.link,
              classes.button,
            )}
            onClick={handleLogout}
          >
            <Icon
              name="logout"
              className={classNames(
                "is-light p-side-navigation__icon",
                classes.icon,
              )}
            />
            <span
              className={classNames("p-side-navigation__label", classes.label)}
            >
              Sign out
            </span>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default UserInfo;
