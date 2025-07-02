import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { AxiosResponse } from "axios";
import type { Activity } from "../../types";

export const getDateQuery = (fromDate?: string, toDate?: string): string => {
  if (fromDate && toDate) {
    return ` created-after:${fromDate} created-before:${toDate}`;
  } else if (fromDate) {
    return ` created-after:${fromDate}`;
  } else if (toDate) {
    return ` created-before:${toDate}`;
  }
  return "";
};

export const getTypeQuery = (type?: string): string => {
  return type ? ` type:${type}` : "";
};

export const getStatusQuery = (status?: string): string => {
  return status ? ` status:${status}` : "";
};

export const isActivitiesEmptyState = ({
  currentPage,
  getActivitiesQueryLoading,
  getActivitiesQueryResult,
  pageSize,
  searchQuery,
}: {
  currentPage: number;
  getActivitiesQueryLoading: boolean;
  getActivitiesQueryResult?: AxiosResponse<ApiPaginatedResponse<Activity>>;
  pageSize: number;
  searchQuery: string;
}) => {
  return (
    !searchQuery &&
    currentPage === 1 &&
    pageSize === 20 &&
    !getActivitiesQueryLoading &&
    (!getActivitiesQueryResult || !getActivitiesQueryResult.data.count)
  );
};

export const isActivitiesLoadingState = ({
  currentPage,
  getActivitiesQueryLoading,
  pageSize,
  searchQuery,
}: {
  currentPage: number;
  getActivitiesQueryLoading: boolean;
  pageSize: number;
  searchQuery?: string;
}) => {
  return (
    !searchQuery &&
    currentPage === 1 &&
    pageSize === 20 &&
    getActivitiesQueryLoading
  );
};

export const isActivitiesLoadedState = ({
  currentPage,
  getActivitiesQueryLoading,
  getActivitiesQueryResult,
  pageSize,
  searchQuery,
}: {
  currentPage: number;
  getActivitiesQueryLoading: boolean;
  getActivitiesQueryResult?: AxiosResponse<ApiPaginatedResponse<Activity>>;
  pageSize: number;
  searchQuery?: string;
}) => {
  return (
    !!searchQuery ||
    currentPage !== 1 ||
    pageSize !== 20 ||
    (!getActivitiesQueryLoading &&
      getActivitiesQueryResult &&
      getActivitiesQueryResult.data.count > 0)
  );
};
