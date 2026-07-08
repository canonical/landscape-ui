import type usePageParams from "@/hooks/usePageParams";

export type FilterType = Pick<
  ReturnType<typeof usePageParams>,
  | "accessGroups"
  | "availabilityZones"
  | "contractExpiryDays"
  | "fromDate"
  | "os"
  | "status"
  | "tags"
  | "toDate"
  | "type"
  | "query"
  | "passRateFrom"
  | "passRateTo"
  | "upgrades"
  | "wsl"
>;

export type FilterKey = keyof FilterType;
