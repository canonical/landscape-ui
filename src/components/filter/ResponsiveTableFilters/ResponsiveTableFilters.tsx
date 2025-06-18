import type { FC, ReactElement, ReactNode } from "react";
import { isValidElement, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import classNames from "classnames";
import type { Position } from "@canonical/react-components";
import { ContextualMenu } from "@canonical/react-components";

import { BREAKPOINT_PX } from "@/constants";

import classes from "./ResponsiveTableFilters.module.scss";
import type { TableFilterProps } from "@/components/filter/TableFilter/types";
import ResponsiveTableFilterItem from "@/components/filter/ResponsiveTableFilters/components/ResponsiveTableFilterItem";

export interface ResponsiveTableFiltersProps {
  readonly filters: ReactNode[];
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

  const { inlineFilters, collapsedFilters } = useMemo(() => {
    return isLarge
      ? { inlineFilters: filters, collapsedFilters: [] }
      : { inlineFilters: [], collapsedFilters: filters };
  }, [filters, isLarge]);

  return (
    <div className={classNames(classes.wrapper, className)}>
      {inlineFilters.map((node, i) => (
        <span key={i}>{node}</span>
      ))}

      {collapsedFilters.length > 0 && (
        <ContextualMenu
          position={menuPosition}
          hasToggleIcon
          toggleLabel={menuLabel}
          toggleClassName="u-no-margin--bottom"
        >
          <div className={classes.menuContainer}>
            {collapsedFilters.map((node, i) => {
              if (!isValidElement(node)) {
                console.warn(
                  "ResponsiveTableFilters: Filter node is not a valid React element.",
                );
                return;
              }

              const el = node as ReactElement<TableFilterProps>;

              if (el.key?.includes("divider")) {
                return <hr key={i} className={classes.divider} />;
              }

              return <ResponsiveTableFilterItem key={i} el={el} />;
            })}
          </div>
        </ContextualMenu>
      )}
    </div>
  );
};

export default ResponsiveTableFilters;
