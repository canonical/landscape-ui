import type { ReactNode } from "react";
import type {
  GroupedOption,
  MultipleSelectProps,
  SingleSelectProps,
} from "./types";

export const getToggleLabel = ({
  label,
  options,
  otherProps,
}: {
  label: ReactNode;
  options: GroupedOption[];
  otherProps: SingleSelectProps | MultipleSelectProps;
}): ReactNode => {
  if (!otherProps.multiple && otherProps.showSelectionOnToggleLabel) {
    return (
      options.find((selection) => selection.value === otherProps.selectedItem)
        ?.label || label
    );
  }

  return label;
};
