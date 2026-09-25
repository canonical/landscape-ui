import classNames from "classnames";
import LoadingState from "@/components/layout/LoadingState";
import { Link, matchPath, useLocation } from "react-router";
import classes from "./SecondaryNavigation.module.scss";
import { useMediaQuery } from "usehooks-ts";
import type { FC, ReactNode } from "react";
import type { MenuItem } from "../Navigation/types";
import useEnv from "@/hooks/useEnv";
import { getFilteredByEnvItems } from "../Navigation/helpers";
import { useSelfHostedLicense } from "@/context/selfHostedLicense";

interface SecondaryNavigationProps {
  readonly title: ReactNode;
  readonly items: MenuItem[];
  readonly children?: ReactNode;
}

const hasSelfHostedLicenseItem = (items: MenuItem[]): boolean =>
  items.some((item) => item.requiresSelfHostedLicense);

export const SecondaryNavigation: FC<SecondaryNavigationProps> = ({
  title,
  items,
  children,
}) => {
  const location = useLocation();
  const { isSaas, isSelfHosted } = useEnv();
  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const {
    isGettingSelfHostedEnabled,
    isSelfHostedEnabled,
    selfHostedEnabledError,
    isEntitlementQueryEnabled,
  } = useSelfHostedLicense();
  const shouldGetSelfHostedEnabled =
    isEntitlementQueryEnabled && hasSelfHostedLicenseItem(items);
  const isEntitlementLoading =
    shouldGetSelfHostedEnabled &&
    isGettingSelfHostedEnabled &&
    !selfHostedEnabledError;

  const filteredItems = getFilteredByEnvItems({
    isSaas,
    isSelfHosted,
    isSelfHostedLicenseEnabled: isSelfHostedEnabled,
    items,
  });

  if (!isLargeScreen) {
    return null;
  }

  return (
    <div
      className={classNames(
        "l-navigation__drawer",
        classes.secondaryNavigationDrawer,
      )}
    >
      <div
        className={classNames(
          "p-side-navigation p-panel is-dark",
          classes.secondaryNavigation,
        )}
      >
        <nav
          aria-busy={isEntitlementLoading}
          className={classNames(
            "u-padding-top--medium is-dark",
            classes.secondaryNavigation__drawer,
          )}
          aria-labelledby="secondary-navigation-title"
        >
          <h2
            className={classNames(
              "p-heading--4 p-panel__logo-name is-dark u-no-padding--top",
              classes.secondaryNavigation__title,
            )}
            id="secondary-navigation-title"
          >
            {title}
          </h2>
          <ul className="p-side-navigation__list">
            {isEntitlementLoading ? (
              <li>
                <LoadingState />
              </li>
            ) : (
              filteredItems.map((item) => {
                const isActive = matchPath(item.path, location.pathname);
                return (
                  <li key={item.path}>
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        "p-side-navigation__link",
                        classes.secondaryNavigation__link,
                        isActive && classes.isActive,
                      )}
                      to={item.path}
                    >
                      <span className={classes.secondaryNavigation__label}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </nav>
        {children && <div className={classes.footer}>{children}</div>}
      </div>
    </div>
  );
};

export default SecondaryNavigation;
