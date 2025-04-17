export const isScriptsLoadingState = (
  currentPage: number,
  pageSize: number,
  isLoading: boolean,
  search: string,
) => currentPage === 1 && pageSize === 20 && isLoading && !search;

export const isScriptsEmptyState = (
  currentPage: number,
  pageSize: number,
  isLoading: boolean,
  count: number,
  search: string,
) =>
  currentPage === 1 && pageSize === 20 && !isLoading && count === 0 && !search;
