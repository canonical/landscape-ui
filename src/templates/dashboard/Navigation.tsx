import { FC } from "react";
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
  const { pathname } = useLocation();

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="u-no-margin--left u-no-padding--left">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <h3
                className={classNames(
                  "p-side-navigation__heading p-muted-heading",
                  classes.content
                )}
              >
                {item.icon && (
                  <i
                    className={classNames(
                      `p-icon--${item.icon} is-light p-side-navigation__icon`,
                      classes.icon
                    )}
                  />
                )}
                <span>{item.label}</span>
              </h3>
              {item.items && item.items.length > 0 && (
                <ul className="p-side-navigation__list">
                  {item.items.map((subItem) => (
                    <li key={subItem.path} className="p-side-navigation__item">
                      <Link
                        className={classNames(
                          "p-side-navigation__link",
                          classes.content
                        )}
                        to={subItem.path}
                        aria-current={
                          pathname === subItem.path ? "page" : undefined
                        }
                      >
                        {subItem.icon && (
                          <i
                            className={`p-icon--${subItem.icon} is-light p-side-navigation__icon`}
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
