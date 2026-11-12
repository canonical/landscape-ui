import type { BadgeProps } from "@canonical/react-ds-global";
import type { ComponentProps } from "react";

interface OwnProps {
  /** Current value, clamped between `min` and `max`. */
  value: number;
  min?: number;
  max?: number;
  /** Criticality modifier that colors the fill. */
  criticality?: BadgeProps["criticality"];
}

export type MeterProps = OwnProps &
  Omit<ComponentProps<"div">, keyof OwnProps | "children" | "role">;
