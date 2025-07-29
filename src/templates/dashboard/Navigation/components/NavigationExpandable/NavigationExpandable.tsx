import type { FC } from "react";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import NavigationLink from "@/templates/dashboard/Navigation/components/NavigationLink";
import { useLocation } from "react-router";
import { getPathToExpand } from "@/templates/dashboard/Navigation/helpers";
import NavigationRoute from "@/templates/dashboard/Navigation/components/NavigationRoute";
import NavigationExpandableParent from "@/templates/dashboard/Navigation/components/NavigationExpandableParent";

interface NavigationExpandableProps {
  readonly item: MenuItem;
}

const NavigationExpandable: FC<NavigationExpandableProps> = ({ item }) => {
  const [expanded, setExpanded] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldBeExpandedPath = getPathToExpand(pathname);

    if (shouldBeExpandedPath) {
      setExpanded(shouldBeExpandedPath);
    }
  }, [pathname]);

  return (
    <>
      <NavigationExpandableParent
        item={item}
        expanded={expanded}
        onClick={() => {
          setExpanded(expanded === item.path ? "" : item.path);
        }}
      />
      {item.items && item.items.length > 0 && (
        <ul
          className="p-side-navigation__list"
          aria-expanded={expanded === item.path}
        >
          {item.items.map((subItem) => (
            <li key={subItem.path}>
              {subItem.path.startsWith("http") ? (
                <NavigationLink item={subItem} />
              ) : (
                <NavigationRoute
                  item={subItem}
                  current={pathname === subItem.path}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default NavigationExpandable;
