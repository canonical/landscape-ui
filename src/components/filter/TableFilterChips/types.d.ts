import { usePageParams } from "@/hooks/usePageParams";
import { SearchAndFilterChip } from "@canonical/react-components/dist/components/SearchAndFilter/types";

export type FilterKey = keyof Omit<
  ReturnType<typeof usePageParams>,
  | "currentPage"
  | "days"
  | "disabledColumns"
  | "groupBy"
  | "pageSize"
  | "setPageParams"
  | "tab"
>;

export interface ExtendedSearchAndFilterChip extends SearchAndFilterChip {
  title?: string;
}
