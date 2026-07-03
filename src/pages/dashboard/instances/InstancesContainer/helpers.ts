import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

export const isInstancesEmptyState = (
  currentPage: number,
  pageSize: number,
  instanceCount: number | undefined,
  isFilteringInstances: boolean,
  isGettingInstances: boolean,
) =>
  currentPage === 1 &&
  pageSize === DEFAULT_PAGE_SIZE &&
  !isGettingInstances &&
  instanceCount === 0 &&
  !isFilteringInstances;
