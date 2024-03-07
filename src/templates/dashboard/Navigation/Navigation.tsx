import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import classes from "./Navigation.module.scss";
import { ROOT_PATH } from "@/constants";

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  items?: MenuItem[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Overview",
    path: `${ROOT_PATH}overview`,
    icon: "switcher-dashboard",
  },
  {
    label: "Instances",
    path: `${ROOT_PATH}instances`,
    icon: "machines",
  },
  {
    label: "Activities",
    path: `${ROOT_PATH}activities`,
    icon: "switcher-environments",
  },
  {
    label: "Scripts",
    path: `${ROOT_PATH}scripts`,
    icon: "code",
  },
  {
    label: "Profiles",
    path: `${ROOT_PATH}profile`,
    icon: "cluster",
    items: [
      {
        label: "Package profiles",
        path: `${ROOT_PATH}profiles/package`,
      },
      {
        label: "Upgrade profiles",
        path: `${ROOT_PATH}profiles/upgrade`,
      },
      {
        label: "Removal profiles",
        path: `${ROOT_PATH}profiles/removal`,
      },
    ],
  },
  {
    label: "Repositories",
    path: `${ROOT_PATH}repositories`,
    icon: "fork",
    items: [
      {
        label: "Mirrors",
        path: `${ROOT_PATH}repositories/mirrors`,
      },
      {
        label: "Repository profiles",
        path: `${ROOT_PATH}repositories/profiles`,
      },
      {
        label: "GPG Keys",
        path: `${ROOT_PATH}repositories/gpg-keys`,
      },
      {
        label: "APT Sources",
        path: `${ROOT_PATH}repositories/apt-sources`,
      },
    ],
  },
  {
    label: "Monitoring",
    path: `${ROOT_PATH}monitoring`,
    icon: "status",
    items: [
      {
        label: "Reports",
        path: `${ROOT_PATH}monitoring/reports`,
      },
      {
        label: "Event logs",
        path: `${ROOT_PATH}monitoring/event-logs`,
      },
      {
        label: "Alerts",
        path: `${ROOT_PATH}monitoring/alerts`,
      },
    ],
  },
  {
    label: "Org. settings",
    path: `${ROOT_PATH}settings`,
    icon: "settings",
    items: [
      {
        label: "Administrators",
        path: `${ROOT_PATH}settings/administrators`,
      },
      {
        label: "Access groups",
        path: `${ROOT_PATH}settings/access-groups`,
      },
    ],
  },
  {
    label: "Help",
    path: `${ROOT_PATH}Help`,
    icon: "help",
    items: [
      {
        label: "Legal",
        path: "https://ubuntu.com/legal",
      },
      {
        label: "Documentation",
        path: "https://ubuntu.com/landscape/docs",
      },
      {
        label: "Support",
        path: "https://portal.support.canonical.com/staff/s/",
      },
    ],
  },
];

const Navigation: FC = () => {
  const [expanded, setExpanded] = useState("");

  useEffect(() => {
    setExpanded(`${ROOT_PATH}repositories`);
  }, []);

  const { pathname } = useLocation();

  useEffect(() => {
    const shouldBeExpandedPath = MENU_ITEMS.filter(
      ({ items }) => items && items.length > 0,
    ).find(({ path }) => pathname.startsWith(path))?.path;

    if (shouldBeExpandedPath) {
      setExpanded(shouldBeExpandedPath);
    }
  }, [pathname]);

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.path}
              className={classNames("p-side-navigation__item", {
                [classes.helpContainer]: item.label === "Help",
              })}
            >
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
                          <span className="p-side-navigation__label">
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
                          <span className="p-side-navigation__label">
                            {subItem.label}
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
