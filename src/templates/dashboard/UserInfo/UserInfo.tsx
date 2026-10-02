import type { FC } from "react";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Button, Icon } from "@canonical/react-components";
import classes from "./UserInfo.module.scss";
import classNames from "classnames";
import { Link, useLocation } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import { ACCOUNT_SETTINGS } from "../SecondaryNavigation/constants";
import { useAlertsSummary } from "@/features/alert-notifications";
import { ROUTES } from "@/libs/routes";
import { TSV_EXPORTS_ENABLED } from "@/constants";
import LogoutButton from "./LogoutButton";
import useEnv from "@/hooks/useEnv";
import { useSelfHostedLicense } from "@/context/selfHostedLicense";
import { getFilteredByEnvItems } from "../Navigation/helpers";
import LoadingState from "@/components/layout/LoadingState";

const UserInfo: FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const { pathname, search } = useLocation();
  const isSmallerScreen = useMediaQuery("(max-width: 619px)");
  const { envError, isSaas, isSelfHosted } = useEnv();
  const {
    isGettingSelfHostedEnabled,
    isSelfHostedEnabled,
    isEntitlementQueryEnabled,
    selfHostedEnabledError,
  } = useSelfHostedLicense();
  const isEntitlementLoading =
    !envError &&
    isEntitlementQueryEnabled &&
    isGettingSelfHostedEnabled &&
    !selfHostedEnabledError;
  const accountSettingsItems = getFilteredByEnvItems({
    isSaas: !envError && isSaas,
    isSelfHosted: !envError && isSelfHosted,
    isSelfHostedLicenseEnabled: !envError && isSelfHostedEnabled,
    items: ACCOUNT_SETTINGS.items,
  });
  const { hasAlerts } = useAlertsSummary();

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
                aria-label="Account settings"
                aria-busy={isEntitlementLoading}
                className="p-side-navigation__list"
                aria-expanded={expandedAccountSettings}
              >
                {isEntitlementLoading ? (
                  <li>
                    <span
                      className={classNames(
                        "p-side-navigation__link",
                        classes.link,
                      )}
                    >
                      <LoadingState inline />
                    </span>
                  </li>
                ) : (
                  accountSettingsItems.map((accountSettingItem) => (
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
                  ))
                )}
              </ul>
            </>
          )}
          {!isSmallerScreen && (
            <Link
              to={ROUTES.account.general()}
              className={classNames(
                "p-side-navigation__link",
                classes.accordionButton,
              )}
              aria-expanded={false}
              aria-current={
                pathname.includes(ROUTES.account.root()) ? "page" : undefined
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
        {TSV_EXPORTS_ENABLED && (
          <li className="p-side-navigation__item">
            <Link
              className={classNames("p-side-navigation__link", classes.link)}
              to={ROUTES.exports.root()}
              aria-current={
                pathname.includes(ROUTES.exports.root()) ? "page" : undefined
              }
            >
              <Icon
                name="export"
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
                Exports
              </span>
            </Link>
          </li>
        )}
        <li className="p-side-navigation__item">
          <Link
            className={classNames("p-side-navigation__link", classes.link)}
            to={ROUTES.alerts.root()}
            aria-current={
              pathname === ROUTES.alerts.root() ? "page" : undefined
            }
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
            {hasAlerts && (
              <Icon
                className={classes.alerts}
                name="security-upgrades"
                aria-label="There are unresolved alerts"
              />
            )}
          </Link>
        </li>
        {isSuperAdmin && (
          <li className="p-side-navigation__item">
            <Link
              className={classNames("p-side-navigation__link", classes.link)}
              to={ROUTES.superAdmin.root()}
              state={{ returnTo: `${pathname}${search}` }}
            >
              <Icon
                name="security"
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
                Super admin
              </span>
            </Link>
          </li>
        )}
        <li className="p-side-navigation__item">
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
};

export default UserInfo;
