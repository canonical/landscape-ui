import type { ReactNode } from "react";
import type { MenuLink, Position } from "@canonical/react-components";

export interface ButtonLikeProps {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  title?: string;
}

export interface ContextualMenuProps {
  toggleLabel?: ReactNode;
  links?: MenuLink[];
  toggleDisabled?: boolean;
  toggleClassName?: string;
  hasToggleIcon?: boolean;
  position?: Position;
  dropdownProps?: Record<string, unknown>;
  className?: string;
}

export interface CollapsedNode {
  key: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  className?: string;
  position?: Position;
}

export type CollapsedLink = MenuLink & { key: string };
