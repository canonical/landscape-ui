import type { ButtonProps } from "@canonical/react-components";

export type Action = Omit<ButtonProps, "children" | "hasIcon"> & {
  icon: string;
  label: string;
  collapsed?: boolean;
  excluded?: boolean;
};
