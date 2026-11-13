import type { TooltipProps } from "./types";

export const TOOLTIP_DIRECTIONS = {
  top: ["block-start", "block-end", "inline-start", "inline-end"],
  topStart: [
    { side: "block-start", align: "start" },
    { side: "block-end", align: "start" },
    "block-start",
    "block-end",
  ],
  topEnd: [
    { side: "block-start", align: "end" },
    { side: "block-end", align: "end" },
    "block-start",
    "block-end",
  ],
  bottom: ["block-end", "block-start", "inline-end", "inline-start"],
  bottomStart: [
    { side: "block-end", align: "start" },
    { side: "block-start", align: "start" },
    "block-end",
    "block-start",
  ],
  bottomEnd: [
    { side: "block-end", align: "end" },
    { side: "block-start", align: "end" },
    "block-end",
    "block-start",
  ],
  left: ["inline-start", "inline-end", "block-start", "block-end"],
  right: ["inline-end", "inline-start", "block-start", "block-end"],
} satisfies Record<string, NonNullable<TooltipProps["preferredDirections"]>>;
