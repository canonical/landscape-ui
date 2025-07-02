import type { FC, JSXElementConstructor, ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";
import classNames from "classnames";
import type { Position } from "@canonical/react-components";
import { ContextualMenu } from "@canonical/react-components";

import { BREAKPOINT_PX } from "@/constants";

import classes from "./ResponsiveTableFilters.module.scss";
import ResponsiveTableFilterItem from "@/components/filter/ResponsiveTableFilters/components/ResponsiveTableFilterItem";
import type { FilterProps } from "@/components/filter/types";

export interface ResponsiveTableFiltersProps {
  readonly filters: ReactElement<
    FilterProps,
    JSXElementConstructor<{ name: string }>
  >[];
  readonly collapseFrom?: keyof typeof BREAKPOINT_PX;
  readonly menuLabel?: string;
  readonly className?: string;
  readonly menuPosition?: Position;
}

const ResponsiveTableFilters: FC<ResponsiveTableFiltersProps> = ({
  filters,
  collapseFrom = "md",
  menuLabel = "Filters",
  className,
  menuPosition = "right",
}) => {
  const isLarge = useMediaQuery(
    `(min-width: ${BREAKPOINT_PX[collapseFrom]}px)`,
  );

  return (
    <div className={classNames(classes.wrapper, className)}>
      {isLarge ? (
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

              return <ResponsiveTableFilterItem key={i} el={node} />;
            })}
          </div>
        </ContextualMenu>
      )}
    </div>
  );
};

export default ResponsiveTableFilters;
