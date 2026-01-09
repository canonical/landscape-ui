import type { SelectOption } from "@/types/SelectOption";
import type { Position } from "@canonical/react-components";
import type { FC, ReactNode } from "react";

export interface GroupedOption extends SelectOption {
  group?: string;
}

export interface BaseFilterProps {
  label: ReactNode;
  options: readonly GroupedOption[];
  disabledOptions?: SelectOption[];
  hasBadge?: boolean;
  hasToggleIcon?: boolean;
  onSearch?: (search: string) => void;
  position?: Position;
  inline?: boolean;
}

export interface SingleFilterProps extends BaseFilterProps {
  type: "single";
  onItemSelect: (item: string) => void;
  selectedItem: string;
  showSelectionOnToggleLabel?: boolean;
}

export interface MultipleFilterProps extends BaseFilterProps {
  type: "multiple";
  onItemsSelect: (items: string[]) => void;
  selectedItems: string[];
  showSelectedItemCount?: boolean;
  hideSelectAllButton?: boolean;
}

export interface CustomFilterComponentProps {
  closeMenu?: () => void;
}

export interface CustomFilterProps
  extends Omit<BaseFilterProps, "options" | "disabledOptions" | "onSearch"> {
  type: "custom";
  customComponent: FC<CustomFilterComponentProps>;
}

export type TableFilterProps =
  | SingleFilterProps
  | MultipleFilterProps
  | CustomFilterProps;
