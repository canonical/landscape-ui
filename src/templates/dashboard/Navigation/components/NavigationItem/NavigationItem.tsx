import NavigationExpandable from "@/templates/dashboard/Navigation/components/NavigationExpandable";
import NavigationLink from "@/templates/dashboard/Navigation/components/NavigationLink";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import classes from "@/templates/dashboard/Navigation/Navigation.module.scss";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import classNames from "classnames";
import type { FC } from "react";
import { useLocation } from "react-router";

interface NavigationItemProps {
  readonly item: MenuItem;
}

const NavigationItem: FC<NavigationItemProps> = ({ item }) => {
  const { pathname } = useLocation();

  return (
    <li
      key={item.path}
      className={classNames("p-side-navigation__item", {
        [classes.hasDivider]: item.hasDivider,
      })}
    >
      {item.items && item.items.length > 0 ? (
        <NavigationExpandable item={item} />
      ) : (
        <>
          {item.path.startsWith("http") ? (
            <NavigationLink item={item} />
          ) : (
            <NavigationRoute
              item={item}
              current={pathname.startsWith(item.path)}
            />
          )}
        </>
      )}
    </li>
  );
};

export default NavigationItem;
