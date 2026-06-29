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
  search: string,
  status: string,
  isInstanceLoading: boolean,
) => {
  // If count is unavailable, avoid rendering an empty state based on incomplete data.
  if (instanceCount === undefined) {
    return true;
  }

  return (
    currentPage === 1 &&
    pageSize === DEFAULT_PAGE_SIZE &&
    !isInstanceLoading &&
    instanceCount === 0 &&
    !search &&
    !status
  );
};
