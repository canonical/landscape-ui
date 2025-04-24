export const isScriptsLoadingState = (
  currentPage: number,
  pageSize: number,
  isLoading: boolean,
) => currentPage === 1 && pageSize === 20 && isLoading;

export const isScriptsEmptyState = (
  currentPage: number,
  pageSize: number,
  isLoading: boolean,
  count: number,
  search: string,
  status: string,
) =>
  currentPage === 1 &&
  pageSize === 20 &&
  !isLoading &&
  count === 0 &&
  !search &&
  !status;
