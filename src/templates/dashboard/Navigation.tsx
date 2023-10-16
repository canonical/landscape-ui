import { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import classes from "./Navigation.module.scss";

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  items?: MenuItem[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Machines",
    path: "/machines",
    icon: "pods",
  },
  {
    label: "Activities",
    path: "/activities",
    icon: "status",
  },
  {
    label: "Repositories",
    path: "/repositories",
    icon: "fork",
    items: [
      {
        label: "Mirrors",
        path: "/repositories/mirrors",
      },
      {
        label: "Profiles",
        path: "/repositories/profiles",
      },
      {
        label: "GPG Keys",
        path: "/repositories/gpg-keys",
      },
      {
        label: "APT Sources",
        path: "/repositories/apt-sources",
      },
    ],
  },
];

const Navigation: FC = () => {
  const [expanded, setExpanded] = useState("");

  const { pathname } = useLocation();

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
          {MENU_ITEMS.map((item) => (
            <li key={item.path} className="p-side-navigation__item">
              {item.items && item.items.length > 0 ? (
                <button
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
                      classes.topLevelItem,
                    )}
                  >
                    {item.label}
                  </span>
                </button>
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
                      classes.topLevelItem,
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
                  {item.items.map((subItem) => (
                    <li key={subItem.path}>
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
                        <span className="p-side-navigation__label">
                          {subItem.label}
                        </span>
                      </Link>
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
