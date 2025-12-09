import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { SavedSearch } from "../types";

export interface CreateSavedSearchParams {
  search: string;
  title: string;
  name?: string;
}

export const useCreateSavedSearch = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    SavedSearch,
    AxiosError<ApiError>,
    CreateSavedSearchParams
  >({
    mutationKey: ["savedSearches", "create"],
    mutationFn: async (params) =>
      authFetch.get("CreateSavedSearch", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] }),
  });

  return {
    createSavedSearch: mutateAsync,
    isCreatingSavedSearch: isPending,
  };
};
