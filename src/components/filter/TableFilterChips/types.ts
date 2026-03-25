import type usePageParams from "@/hooks/usePageParams";

export type FilterType = Pick<
  ReturnType<typeof usePageParams>,
  | "accessGroups"
  | "availabilityZones"
  | "contractExpiryDays"
  | "fromDate"
  | "os"
  | "search"
  | "status"
  | "tags"
  | "toDate"
  | "type"
  | "query"
  | "passRateFrom"
  | "passRateTo"
  | "wsl"
>;

export type FilterKey = keyof FilterType;
