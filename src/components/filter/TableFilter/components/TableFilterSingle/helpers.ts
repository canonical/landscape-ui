import type { ReactNode } from "react";
import type { GroupedOption, SingleFilterProps } from "../../types";

export const getToggleLabel = ({
  label,
  options,
  otherProps,
}: {
  label: ReactNode;
  options: GroupedOption[];
  otherProps: Pick<
    SingleFilterProps,
    "showSelectionOnToggleLabel" | "selectedItem"
  >;
}): ReactNode => {
  if (otherProps.showSelectionOnToggleLabel) {
    const option = options.find(
      (selection) => selection.value === otherProps.selectedItem,
    );

    if (option) {
      return option.label;
    }
  }

  return label;
};
