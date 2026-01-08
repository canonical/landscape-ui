import type { FC, JSXElementConstructor, ReactElement, ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import classNames from "classnames";
import type { Position } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";

import { BREAKPOINT_PX } from "@/constants";

import classes from "./ResponsiveTableFilters.module.scss";
import ResponsiveDropdownItem from "@/components/ui/ResponsiveDropdownItem";
import type { FilterProps } from "@/components/filter/types";

export interface ResponsiveTableFiltersProps {
  readonly filters: ReactElement<
    FilterProps,
    JSXElementConstructor<{ name: string }>
  >[];
  readonly collapseFrom?: keyof typeof BREAKPOINT_PX;
  readonly menuLabel?: ReactNode;
  readonly className?: string;
  readonly menuPosition?: Position;
  readonly isCollapsed?: boolean;
}

const ResponsiveTableFilters: FC<ResponsiveTableFiltersProps> = ({
  filters,
  collapseFrom = "md",
  className,
  menuPosition = "left",
  isCollapsed = false,
  menuLabel = (
    <>
      <Icon name="filter" />
      <span>Filters</span>
    </>
  ),
}) => {
  const isLarge = useMediaQuery(
    `(min-width: ${BREAKPOINT_PX[collapseFrom]}px)`,
  );

  return (
    <div className={classNames(classes.wrapper, className)}>
      {isLarge && !isCollapsed ? (
        filters.map((node, i) => <span key={i}>{node}</span>)
      ) : (
        <ContextualMenu
          position={menuPosition}
          hasToggleIcon
          toggleLabel={menuLabel}
          toggleClassName="u-no-margin--bottom"
        >
          <div className={classes.menuContainer}>
            {filters.map((node, i) => {
              if (!node.type.name) {
                return node;
              }

              return <ResponsiveDropdownItem key={i} el={node} />;
            })}
          </div>
        </ContextualMenu>
      )}
    </div>
  );
};

export default ResponsiveTableFilters;
