import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Usn } from "@/types/Usn";
import type { AxiosResponse } from "axios";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

export const isSecurityLoadingState = ({
  currentPage,
  getUsnsQueryLoading,
  pageSize,
  search,
}: {
  search: string;
  currentPage: number;
  pageSize: number;
  getUsnsQueryLoading: boolean;
}) => {
  return (
    !search &&
    currentPage === 1 &&
    pageSize === DEFAULT_PAGE_SIZE &&
    getUsnsQueryLoading
  );
};

export const isSecurityEmptyState = ({
  search,
  currentPage,
  pageSize,
  getUsnsQueryLoading,
  getUsnsQueryResult,
}: {
  search: string;
  currentPage: number;
  pageSize: number;
  getUsnsQueryLoading: boolean;
  getUsnsQueryResult?: AxiosResponse<ApiPaginatedResponse<Usn>>;
}) => {
  return (
    !search &&
    currentPage === 1 &&
    pageSize === DEFAULT_PAGE_SIZE &&
    !getUsnsQueryLoading &&
    (!getUsnsQueryResult || getUsnsQueryResult.data.results.length === 0)
  );
};

export const isSecurityListLoaded = ({
  currentPage,
  getUsnsQueryLoading,
  getUsnsQueryResult,
  pageSize,
  search,
}: {
  currentPage: number;
  getUsnsQueryLoading: boolean;
  getUsnsQueryResult?: AxiosResponse<ApiPaginatedResponse<Usn>>;
  pageSize: number;
  search: string;
}) => {
  return (
    search ||
    currentPage > 1 ||
    pageSize !== DEFAULT_PAGE_SIZE ||
    (!getUsnsQueryLoading &&
      getUsnsQueryResult &&
      getUsnsQueryResult.data.results.length > 0)
  );
};
