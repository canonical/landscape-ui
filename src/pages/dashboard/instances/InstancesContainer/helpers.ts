import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

export const isInstanceLoadingState = (
  currentPage: number,
  pageSize: number,
  isInstanceLoading: boolean,
) => currentPage === 1 && pageSize === DEFAULT_PAGE_SIZE && isInstanceLoading;

export const isInstancesEmptyState = (
  currentPage: number,
  pageSize: number,
  instanceCount = 0,
  search: string,
  status: string,
  isInstanceLoading: boolean,
) =>
  currentPage === 1 &&
  pageSize === DEFAULT_PAGE_SIZE &&
  !isInstanceLoading &&
  instanceCount === 0 &&
  !search &&
  !status;
