import type { FC } from "react";
import classNames from "classnames";
import classes from "@/templates/dashboard/Navigation/Navigation.module.scss";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import { Badge } from "@canonical/react-ds-global";
import { Link } from "react-router";

interface NavigationRouteProps {
  readonly item: MenuItem;
  readonly current?: boolean;
  readonly className?: string;
  readonly withLinkStyle?: boolean;
}

const NavigationRoute: FC<NavigationRouteProps> = ({
  item,
  current,
  className,
  withLinkStyle = true,
}) => {
  return (
    <Link
      className={classNames(
        "p-side-navigation__link",
        { [classes.link]: withLinkStyle },
        className,
      )}
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
          [classes.hasBadge]: item.badge !== undefined && item.badge.count > 0,
        })}
      >
        {item.label}
        {item.badge !== undefined && item.badge.count > 0 && (
          <div className={classes.badge}>
            <Badge
              value={item.badge.count}
              criticality={item.badge.isNegative ? "error" : undefined}
            />
          </div>
        )}
      </span>
    </Link>
  );
};

export default NavigationRoute;
