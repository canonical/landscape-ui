import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

export const isInstanceLoadingState = (
  currentPage: number,
  pageSize: number,
  isInstanceLoading: boolean,
) => currentPage === 1 && pageSize === DEFAULT_PAGE_SIZE && isInstanceLoading;

export const isInstancesEmptyState = (
  currentPage: number,
  pageSize: number,
  instanceCount: number | undefined,
  isFilteringInstances: boolean,
  isInstanceLoading: boolean,
) =>
  currentPage === 1 &&
  pageSize === DEFAULT_PAGE_SIZE &&
  instanceCount !== undefined &&
  !isInstanceLoading &&
  instanceCount === 0 &&
  !isFilteringInstances;
