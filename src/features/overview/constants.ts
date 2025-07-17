import type { Color, ColorData } from "./types";

export const colorMap: Record<Color, Record<"light" | "dark", ColorData>> = {
  green: {
    light: {
      default: "#0e8420",
      disabled: "#b7dabc",
    },
    dark: {
      default: "#0e8420",
      disabled: "#346339",
    },
  },
  orange: {
    light: {
      default: "#f99b11",
      disabled: "#fad59d",
    },
    dark: {
      default: "#f99b11",
      disabled: "#7e6138",
    },
  },
  red: {
    light: {
      default: "#da0b0b",
      disabled: "#ee9b9b",
    },
    dark: {
      default: "#da0b0b",
      disabled: "#753636",
    },
  },
  background: {
    light: {
      default: "#fbfbfb",
    },
    dark: {
      default: "#202021",
    },
  },
};
