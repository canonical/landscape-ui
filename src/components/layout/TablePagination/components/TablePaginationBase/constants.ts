import type { SelectProps } from "@canonical/react-components";

export const PAGE_SIZE_OPTIONS = [
  { label: "20 / page", value: 20 },
  { label: "50 / page", value: 50 },
  { label: "100 / page", value: 100 },
] as const satisfies SelectProps["options"];
