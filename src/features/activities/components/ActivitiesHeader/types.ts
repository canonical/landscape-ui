import type { PageParams } from "@/libs/pageParamsManager";

export type ActivitiesFilters = Pick<
  PageParams,
  "query" | "status" | "type" | "fromDate" | "toDate"
>;

export interface ActivitiesFilterControls {
  readonly values: ActivitiesFilters;
  readonly onChange: (values: Partial<ActivitiesFilters>) => void;
}
