import type { SelectOption } from "@/types/SelectOption";

export interface ColumnFilterOption extends SelectOption {
  readonly canBeHidden: boolean;
}
