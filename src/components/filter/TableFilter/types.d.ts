import type { SelectOption } from "@/types/SelectOption";
import type { Position } from "@canonical/react-components";

export interface GroupedOption extends SelectOption {
  group?: string;
}

export interface SingleSelectProps {
  multiple: false;
  onItemSelect: (item: string) => void;
  selectedItem: string;
  showSelectionOnToggleLabel?: boolean;
}

export interface MultipleSelectProps {
  multiple: true;
  onItemsSelect: (items: string[]) => void;
  selectedItems: string[];
  showSelectedItemCount?: boolean;
}

export type TableFilterProps = {
  label: ReactNode;
  options: GroupedOption[];
  disabledOptions?: SelectOption[];
  hasBadge?: boolean;
  hasToggleIcon?: boolean;
  onSearch?: (search: string) => void;
  position?: Position;
} & (SingleSelectProps | MultipleSelectProps);
