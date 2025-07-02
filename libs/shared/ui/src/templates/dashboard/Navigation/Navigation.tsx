import { IS_DEV_ENV } from "@/constants";
import { useGetOverLimitSecurityProfiles } from "@/features/security-profiles";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { Badge, Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getFilteredByEnvMenuItems, getPathToExpand } from "./helpers";
import classes from "./Navigation.module.scss";

const INSURANCE_LIMIT = 20;

const Navigation: FC = () => {
  const [expanded, setExpanded] = useState("");

  const { pathname } = useLocation();
  const { isSaas, isSelfHosted } = useEnv();
  const { isOidcAvailable, isFeatureEnabled } = useAuth();

  const { hasOverLimitSecurityProfiles, overLimitSecurityProfilesCount } =
    useGetOverLimitSecurityProfiles({
      limit: INSURANCE_LIMIT,
      offset: 0,
    });

  if (IS_DEV_ENV && overLimitSecurityProfilesCount >= INSURANCE_LIMIT) {
    console.warn(
      `There are ${INSURANCE_LIMIT} or more over-limit security profiles, so the navigation badge will be inaccurate`,
    );
  }

  useEffect(() => {
    const shouldBeExpandedPath = getPathToExpand(pathname);

    if (shouldBeExpandedPath) {
      setExpanded(shouldBeExpandedPath);
    }
  }, [pathname]);

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
          {getFilteredByEnvMenuItems({ isSaas, isSelfHosted })
            .filter(({ requiresFeature }) =>
              requiresFeature ? isFeatureEnabled(requiresFeature) : true,
            )
            .map((item) => (
              <li
                key={item.path}
                className={classNames("p-side-navigation__item", {
                  [classes.helpContainer]: item.label === "Help",
                })}
              >
                {item.items && item.items.length > 0 ? (
                  <Button
                    className={classNames(
                      "p-side-navigation__accordion-button",
                      classes.accordionButton,
                    )}
                    type="button"
                    aria-expanded={expanded === item.path}
                    onClick={() => {
                      setExpanded((prevState) =>
                        item.path === prevState ? "" : item.path,
                      );
                    }}
                  >
                    {item.icon && (
                      <i
                        className={classNames(
                          `p-icon--${item.icon} is-light p-side-navigation__icon`,
                          classes.icon,
                        )}
                      />
                    )}
                    <span
                      className={classNames(
                        "p-side-navigation__label",
                        classes.label,
                      )}
                    >
                      {item.label}
                    </span>
                  </Button>
                ) : (
                  <Link
                    className={classNames(
                      "p-side-navigation__link",
                      classes.link,
                    )}
                    to={item.path}
                    aria-current={pathname === item.path ? "page" : undefined}
                  >
                    {item.icon && (
                      <i
                        className={classNames(
                          `p-icon--${item.icon} is-light p-side-navigation__icon`,
                          classes.icon,
                        )}
                      />
                    )}
                    <span
                      className={classNames(
                        "p-side-navigation__label",
                        classes.label,
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                )}
                {item.items && item.items.length > 0 && (
                  <ul
                    className="p-side-navigation__list"
                    aria-expanded={expanded === item.path}
                  >
                    {item.items
                      .filter(
                        ({ path }) =>
                          !isOidcAvailable ||
                          !path.includes("identity-providers"),
                      )
                      .filter(({ requiresFeature }) =>
                        requiresFeature
                          ? isFeatureEnabled(requiresFeature)
                          : true,
                      )
                      .map((subItem) => (
                        <li key={subItem.path}>
                          {subItem.path.startsWith("http") ? (
                            <a
                              className={classNames(
                                "p-side-navigation__link is-light",
                                classes.link,
                              )}
                              href={subItem.path}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                            >
                              <span
                                className={classNames(
                                  "p-side-navigation__label",
                                  classes.label,
                                )}
                              >
                                {subItem.label}
                              </span>
                            </a>
                          ) : (
                            <Link
                              className={classNames(
                                "p-side-navigation__link",
                                classes.link,
                              )}
                              to={subItem.path}
                              aria-current={
                                pathname === subItem.path ? "page" : undefined
                              }
                            >
                              {subItem.icon && (
                                <i
                                  className={classNames(
                                    `p-icon--${subItem.icon} is-light p-side-navigation__icon`,
                                    classes.icon,
                                  )}
                                />
                              )}
                              <span
                                className={classNames(
                                  "p-side-navigation__label",
                                  classes.label,
                                  {
                                    [classes.hasBadge]:
                                      subItem.label === "Security profiles" &&
                                      hasOverLimitSecurityProfiles,
                                  },
                                )}
                              >
                                {subItem.label}
                                {subItem.label === "Security profiles" &&
                                  hasOverLimitSecurityProfiles && (
                                    <div className={classes.badge}>
                                      <Badge
                                        value={overLimitSecurityProfilesCount}
                                        isNegative
                                      />
                                    </div>
                                  )}
                              </span>
                            </Link>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
