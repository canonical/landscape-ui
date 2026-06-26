import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

export const isInstancesEmptyState = (
  currentPage: number,
  pageSize: number,
  isGettingInstances: boolean,
  instanceCount: number | undefined,
  search: string,
  status: string,
) => {
  // If count is unavailable, avoid rendering an empty state based on incomplete data.
  if (instanceCount === undefined) {
    return true;
  }

  return (
    currentPage === 1 &&
    pageSize === DEFAULT_PAGE_SIZE &&
    !isGettingInstances &&
    instanceCount === 0 &&
    !search &&
    !status
  );
};
