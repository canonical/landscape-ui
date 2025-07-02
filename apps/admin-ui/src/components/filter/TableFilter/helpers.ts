import type { Position } from "@canonical/react-components";
import classes from "./TableFilter.module.scss";

export const getCommonContextualMenuProps = (
  onSearch?: (value: string) => void,
) => {
  return {
    autoAdjust: true,
    toggleAppearance: "base",
    position: "left" as Position,
    hasToggleIcon: true,
    toggleClassName: classes.toggle,
    dropdownClassName: classes.dropdown,
    onToggleMenu: (isOpen: boolean) => {
      if (isOpen && onSearch) {
        onSearch("");
      }
    },
  };
};
