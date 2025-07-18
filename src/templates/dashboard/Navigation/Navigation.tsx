import type { FC } from "react";
import NavigationItem from "@/templates/dashboard/Navigation/components/NavigationItem";
import { useMenuItems } from "@/templates/dashboard/Navigation/hooks/useMenuItems";

const Navigation: FC = () => {
  const menuItems = useMenuItems();

  return (
    <div className="p-side-navigation--icons is-dark">
      <nav aria-label="Main">
        <ul className="u-no-margin--bottom u-no-margin--left u-no-padding--left">
          {menuItems.map((item) => (
            <NavigationItem key={item.path} item={item} />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
