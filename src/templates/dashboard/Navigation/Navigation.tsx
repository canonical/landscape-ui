import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useEnv from "@/hooks/useEnv";
import { MENU_ITEMS } from "./constants";
import classes from "./Navigation.module.scss";

const Navigation: FC = () => {
  const [expanded, setExpanded] = useState("");

  const { pathname } = useLocation();
  const { isSaas, isSelfHosted } = useEnv();

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
          {MENU_ITEMS.filter(
            ({ env }) =>
              (!isSaas && env !== "saas") ||
              (!isSelfHosted && env !== "selfHosted"),
          ).map((item) => (
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
                      classes.label,
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
                            )}
                          >
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
