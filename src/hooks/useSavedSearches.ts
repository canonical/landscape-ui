import useFetchOld from "./useFetchOld";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryFnType } from "../types/QueryFnType";
import { SavedSearch } from "../types/SavedSearch";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";

interface GetSavedSearchesParams {
  limit?: number;
  offset?: number;
}

interface CreateSavedSearchParams {
  name: string;
  title: string;
  search: string;
}

interface EditSavedSearchParams {
  name: string;
  title: string;
  search: string;
}

interface RemoveSavedSearchParams {
  name: string;
}

export const useSavedSearches = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const getSavedSearchesQuery: QueryFnType<
    AxiosResponse<SavedSearch[]>,
    GetSavedSearchesParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<SavedSearch[]>, AxiosError<ApiError>>({
      queryKey: ["savedSearches", queryParams],
      queryFn: () =>
        authFetch!.get("GetSavedSearches", { params: queryParams }),
      ...config,
    });

  const createSavedSearchQuery = useMutation<
    SavedSearch,
    AxiosError<ApiError>,
    CreateSavedSearchParams
  >({
    mutationFn: (params) => authFetch!.get("CreateSavedSearch", { params }),
    onSuccess: () => queryClient.invalidateQueries(["savedSearches"]),
  });

  const editSavedSearchQuery = useMutation<
    SavedSearch,
    AxiosError<ApiError>,
    EditSavedSearchParams
  >({
    mutationFn: (params) => authFetch!.get("EditSavedSearch", { params }),
    onSuccess: () => queryClient.invalidateQueries(["savedSearches"]),
  });

  const removeSavedSearchQuery = useMutation<
    {},
    AxiosError<ApiError>,
    RemoveSavedSearchParams
  >({
    mutationFn: (params) => authFetch!.get("RemoveSavedSearch", { params }),
    onSuccess: () => queryClient.invalidateQueries(["savedSearches"]),
  });

  return {
    getSavedSearchesQuery,
    createSavedSearchQuery,
    editSavedSearchQuery,
    removeSavedSearchQuery,
  };
};
