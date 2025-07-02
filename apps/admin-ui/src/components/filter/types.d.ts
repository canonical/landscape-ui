import type { SelectOption } from "@/types/SelectOption";
import type { BaseFilterProps } from "@/components/filter/TableFilter/types";

export type FilterProps<O = SelectOption> = Pick<
  BaseFilterProps,
  "label" | "inline"
> & {
  readonly options: O[];
};
