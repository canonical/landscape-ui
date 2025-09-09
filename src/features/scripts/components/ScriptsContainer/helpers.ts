import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

export const isScriptsLoadingState = (
  currentPage: number,
  pageSize: number,
  isLoading: boolean,
) => currentPage === 1 && pageSize === DEFAULT_PAGE_SIZE && isLoading;

export const isScriptsEmptyState = (
  currentPage: number,
  pageSize: number,
  isLoading: boolean,
  count: number,
  search: string,
  status: string,
) =>
  currentPage === 1 &&
  pageSize === DEFAULT_PAGE_SIZE &&
  !isLoading &&
  count === 0 &&
  !search &&
  !status;
