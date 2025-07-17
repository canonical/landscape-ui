import type { FC } from "react";
import classNames from "classnames";
import classes from "@/templates/dashboard/Navigation/Navigation.module.scss";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import { Link } from "react-router";
import { Badge } from "@canonical/react-components";

interface NavigationRouteProps {
  readonly item: MenuItem;
  readonly current?: boolean;
  readonly hasBadge?: boolean;
  readonly badgeCount?: number;
}

const NavigationRoute: FC<NavigationRouteProps> = ({
  item,
  current,
  badgeCount,
}) => {
  return (
    <Link
      className={classNames("p-side-navigation__link", classes.link)}
      to={item.path}
      aria-current={current ? "page" : undefined}
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
        className={classNames("p-side-navigation__label", classes.label, {
          [classes.hasBadge]: badgeCount !== undefined && badgeCount > 0,
        })}
      >
        {item.label}
        {badgeCount !== undefined && badgeCount > 0 && (
          <div className={classes.badge}>
            <Badge value={badgeCount} isNegative />
          </div>
        )}
      </span>
    </Link>
  );
};

export default NavigationRoute;
