import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

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
    icon: "pods",
    items: [
      {
        label: "Profiles",
        path: "/repositories/profiles",
      },
      {
        label: "GPG Keys",
        path: "/repositories/gpg-keys",
      },
    ],
  },
];

const Navigation: FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="p-side-navigation__list">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.path}
              className={classNames("p-side-navigation__item", {
                "has-active-child": item.items && pathname.includes(item.path),
              })}
            >
              <Link
                className="p-side-navigation__link"
                to={item.path}
                aria-current={pathname === item.path ? "page" : undefined}
              >
                {item.icon && (
                  <i
                    className={`p-icon--${item.icon} is-light p-side-navigation__icon`}
                  />
                )}
                <span className="p-side-navigation__label">{item.label}</span>
              </Link>
              {item.items && item.items.length > 0 && (
                <ul className="p-side-navigation__list">
                  {item.items.map((subItem) => (
                    <li key={subItem.path} className="p-side-navigation__item">
                      <Link
                        className="p-side-navigation__link"
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
