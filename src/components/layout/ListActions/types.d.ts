import type { ButtonProps } from "@canonical/react-components";

export type ListAction = Omit<ButtonProps, "children" | "hasIcon"> & {
  icon: string;
  label: string;
};
