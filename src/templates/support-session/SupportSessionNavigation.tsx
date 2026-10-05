import navigationClasses from "@/templates/dashboard/Navigation/Navigation.module.scss";
import NavigationExpandableParent from "@/templates/dashboard/Navigation/components/NavigationExpandableParent";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import classNames from "classnames";
import type { FC } from "react";
import { useState } from "react";
import { useLocation } from "react-router";
import classes from "./SupportSessionTemplate.module.scss";
import type { SupportSessionNavItem } from "./types";

interface SupportSessionNavigationProps {
  readonly items: SupportSessionNavItem[];
}

const isBelow = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`);

const SupportSessionNavigation: FC<SupportSessionNavigationProps> = ({
  items,
}) => {
  const { pathname } = useLocation();

  // The group of the current page starts expanded.
  const [expanded, setExpanded] = useState(
    () =>
      items.find(({ items: subItems }) =>
        subItems?.some(({ path }) => isBelow(pathname, path)),
      )?.label ?? "",
  );

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
          {items.map((item) => (
            <li key={item.label} className="p-side-navigation__item">
              {item.items && (
                <>
                  <NavigationExpandableParent
                    item={{
                      label: item.label,
                      icon: item.icon,
                      path: item.label,
                    }}
                    expanded={expanded}
                    onClick={() => {
                      setExpanded(expanded === item.label ? "" : item.label);
                    }}
                  />
                  <ul
                    className="p-side-navigation__list"
                    aria-expanded={expanded === item.label}
                  >
                    {item.items.map((subItem) => (
                      <li key={subItem.path}>
                        <NavigationRoute
                          item={subItem}
                          current={pathname === subItem.path}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!item.items && item.path && (
                <NavigationRoute
                  item={{ label: item.label, icon: item.icon, path: item.path }}
                  current={pathname === item.path}
                />
              )}
              {!item.items && !item.path && (
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
                      `p-icon--${item.icon} is-light p-side-navigation__icon`,
                      navigationClasses.icon,
                    )}
                  />
                  <span
                    className={classNames(
                      "p-side-navigation__label",
                      navigationClasses.label,
                    )}
                  >
                    {item.label}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SupportSessionNavigation;
