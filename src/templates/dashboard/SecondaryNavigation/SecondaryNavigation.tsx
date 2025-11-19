import DarkModeSwitch from "@/templates/dashboard/SecondaryNavigation/components/DarkModeSwitch";
import classNames from "classnames";
import { Link, matchPath, useLocation } from "react-router";
import classes from "./SecondaryNavigation.module.scss";
import { ACCOUNT_SETTINGS } from "./constants";

export const SecondaryNavigation = () => {
  const location = useLocation();

  return (
    <div
      className={classNames(
        "p-side-navigation p-panel is-dark",
        classes.secondaryNavigation,
      )}
    >
      <nav
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
          {ACCOUNT_SETTINGS.label}
        </h2>
        <ul className="p-side-navigation__list">
          {ACCOUNT_SETTINGS.items?.map((item) => {
            const isActive = matchPath(item.path, location.pathname);
            return (
              <li key={item.path}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={classNames(
                    "p-side-navigation__link",
                    classes.secondaryNavigation__link,
                    {
                      [classes.isActive]: isActive,
                    },
                  )}
                  to={item.path}
                >
                  <span className={classes.secondaryNavigation__label}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={classes.footer}>
        <DarkModeSwitch />
      </div>
    </div>
  );
};

export default SecondaryNavigation;
