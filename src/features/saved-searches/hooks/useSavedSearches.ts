import useFetchOld from "@/hooks/useFetchOld";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryFnType } from "@/types/QueryFnType";
import type { SavedSearch } from "../types";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/api/ApiError";
import type { Activity } from "@/features/activities";

interface GetSavedSearchesParams {
  limit?: number;
  offset?: number;
}

interface CreateSavedSearchParams {
  search: string;
  title: string;
  name?: string;
}

interface EditSavedSearchParams {
  name: string;
  search: string;
  title: string;
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
      queryFn: async () =>
        authFetch.get("GetSavedSearches", { params: queryParams }),
      ...config,
    });

  const createSavedSearchQuery = useMutation<
    SavedSearch,
    AxiosError<ApiError>,
    CreateSavedSearchParams
  >({
    mutationFn: async (params) =>
      authFetch.get("CreateSavedSearch", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] }),
  });

  const editSavedSearchQuery = useMutation<
    SavedSearch,
    AxiosError<ApiError>,
    EditSavedSearchParams
  >({
    mutationFn: async (params) => authFetch.get("EditSavedSearch", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] }),
  });

  const removeSavedSearchQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveSavedSearchParams
  >({
    mutationFn: async (params) =>
      authFetch.get("RemoveSavedSearch", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] }),
  });

  return {
    getSavedSearchesQuery,
    createSavedSearchQuery,
    editSavedSearchQuery,
    removeSavedSearchQuery,
  };
};
