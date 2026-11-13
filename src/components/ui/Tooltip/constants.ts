import type { TooltipProps } from "./types";

export const TOOLTIP_DIRECTIONS = {
  bottom: ["block-end", "block-start", "inline-end", "inline-start"],
} satisfies Record<string, NonNullable<TooltipProps["preferredDirections"]>>;
