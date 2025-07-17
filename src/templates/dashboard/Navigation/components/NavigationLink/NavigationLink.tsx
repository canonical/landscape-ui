import type { FC } from "react";
import classNames from "classnames";
import classes from "@/templates/dashboard/Navigation/Navigation.module.scss";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";

interface NavigationLinkProps {
  readonly item: MenuItem;
}

const NavigationLink: FC<NavigationLinkProps> = ({ item }) => {
  return (
    <a
      className={classNames("p-side-navigation__link is-light", classes.link)}
      href={item.path}
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      {item.icon && (
        <i
          className={classNames(
            `p-icon--${item.icon} is-light p-side-navigation__icon`,
            classes.icon,
          )}
        />
      )}
      <span className={classNames("p-side-navigation__label", classes.label)}>
        {item.label}
      </span>
    </a>
  );
};

export default NavigationLink;
