import type { ReactNode } from "react";

export interface ButtonLikeProps {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  title?: string;
}
