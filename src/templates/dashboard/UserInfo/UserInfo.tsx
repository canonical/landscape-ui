import { FC, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Button } from "@canonical/react-components";
import classes from "./UserInfo.module.scss";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import { useMediaQuery } from "usehooks-ts";
import { ACCOUNT_SETTINGS } from "../SecondaryNavigation/constants";

const UserInfo: FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isSmallerScreen = useMediaQuery("(max-width: 619px)");

  const [expandedAccountSettings, setExpandedAccountSettings] = useState(false);

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
                <i
                  className={classNames(
                    `p-icon--account is-light p-side-navigation__icon`,
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
              to={`${ROOT_PATH}account/general`}
              className={classNames(
                "p-side-navigation__link",
                classes.accordionButton,
              )}
              aria-expanded={false}
              aria-current={pathname.includes("account") ? "page" : undefined}
            >
              <i
                className={classNames(
                  `p-icon--account is-light p-side-navigation__icon`,
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
            to={`${ROOT_PATH}alerts`}
            aria-current={
              pathname === `${ROOT_PATH}alerts` ? "page" : undefined
            }
          >
            <i
              className={classNames(
                `p-icon--bell is-light p-side-navigation__icon`,
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
            appearance="base"
            className={classNames(
              "u-no-margin--bottom",
              classes.link,
              classes.logoutButton,
            )}
            onClick={logout}
          >
            <i
              className={classNames(
                `p-icon--logout is-light p-side-navigation__icon`,
                classes.icon,
              )}
            />
            <span
              className={classNames("p-side-navigation__label", classes.label)}
            >
              Log out
            </span>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default UserInfo;
