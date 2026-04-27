import type { FC } from "react";
import classNames from "classnames";
import classes from "@/templates/dashboard/Navigation/Navigation.module.scss";
import { useLocation } from "react-router";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import NavigationLink from "@/templates/dashboard/Navigation/components/NavigationLink";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import NavigationExpandable from "@/templates/dashboard/Navigation/components/NavigationExpandable";

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
            <NavigationRoute item={item} current={pathname === item.path} />
          )}
        </>
      )}
    </li>
  );
};

export default NavigationItem;
