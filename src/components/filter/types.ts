import type { BaseFilterProps } from "@/components/filter/TableFilter/types";
import type { SelectOption } from "@/types/SelectOption";

export type FilterProps<O = SelectOption> = Pick<
  BaseFilterProps,
  "label" | "inline"
> & {
  readonly options: readonly O[];
  onChange?: () => void;
};
