import type { FC, JSXElementConstructor, ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import classNames from "classnames";
import type { Position } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";

import { BREAKPOINT_PX } from "@/constants";

import classes from "./ResponsiveTableFilters.module.scss";
import ResponsiveDropdownItem from "@/components/ui/ResponsiveDropdownItem";
import type { FilterProps } from "@/components/filter/types";

// Rough width a filter submenu needs to the right of the menu before it would
// run off-screen; with less room than this we open submenus to the left.
const SUBMENU_WIDTH_ESTIMATE_PX = 256;

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
  menuPosition,
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

  // The Filters menu sits at the right of the table header. With room to the
  // right it stays left-aligned and its submenus open rightward (default);
  // when it gets close to the right edge it flips to right-aligned and the
  // submenu items reverse (chevron on the left, label on the right) to open
  // leftward and stay on screen. Measured on the always-mounted wrapper (and
  // on resize) so the direction is settled before the menu is opened — no
  // switching mid-use.
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [openLeft, setOpenLeft] = useState(false);

  const measure = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const { right } = wrapper.getBoundingClientRect();
    setOpenLeft(right + SUBMENU_WIDTH_ESTIMATE_PX > window.innerWidth);
  }, []);

  const wrapperCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      wrapperRef.current = node;
      measure();
    },
    [measure],
  );

  useEffect(() => {
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Both the dropdown and its submenus align to the same side; an explicit
  // `menuPosition` prop overrides the measurement.
  const menuAlignment: Position = menuPosition ?? (openLeft ? "right" : "left");

  return (
    <div
      ref={wrapperCallbackRef}
      className={classNames(classes.wrapper, className)}
    >
      {isLarge && !isCollapsed ? (
        filters.map((node, i) => <span key={i}>{node}</span>)
      ) : (
        <ContextualMenu
          position={menuAlignment}
          hasToggleIcon
          toggleLabel={menuLabel}
          toggleClassName="u-no-margin--bottom"
          toggleAppearance="base"
        >
          <div className={classes.menuContainer}>
            {filters.map((node, i) => {
              if (!node.type.name) {
                return node;
              }

              return (
                <ResponsiveDropdownItem
                  key={i}
                  el={node}
                  position={menuAlignment}
                />
              );
            })}
          </div>
        </ContextualMenu>
      )}
    </div>
  );
};

export default ResponsiveTableFilters;
