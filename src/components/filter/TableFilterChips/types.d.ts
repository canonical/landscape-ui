import { usePageParams } from "@/hooks/usePageParams";

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
