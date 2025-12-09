import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { AxiosError } from "axios";
import type { SavedSearch } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface EditSavedSearchParams {
  name: string;
  search: string;
  title: string;
}

export const useEditSavedSearch = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    SavedSearch,
    AxiosError<ApiError>,
    EditSavedSearchParams
  >({
    mutationKey: ["savedSearches", "edit"],
    mutationFn: async (params) => authFetch.get("EditSavedSearch", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] }),
  });

  return {
    editSavedSearch: mutateAsync,
    isEditingSavedSearch: isPending,
  };
};
