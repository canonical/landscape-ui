import { usePageParams } from "@/hooks/usePageParams";

export interface DismissFilter {
  (filterType: "accessGroups", filterValue: string): void;
  (filterType: "availabilityZones", filterValue: string): void;
  (filterType: "groupBy"): void;
  (filterType: "os"): void;
  (filterType: "search"): void;
  (filterType: "status"): void;
  (filterType: "tags", filterValue: string): void;
}

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
