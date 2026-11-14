import type { PageParams } from "@/libs/pageParamsManager";

export type ActivitiesFilters = Pick<
  PageParams,
  "query" | "status" | "type" | "fromDate" | "toDate"
>;
