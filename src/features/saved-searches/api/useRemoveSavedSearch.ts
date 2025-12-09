import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RemoveSavedSearchParams {
  name: string;
}

export const useRemoveSavedSearch = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveSavedSearchParams
  >({
    mutationKey: ["savedSearches", "remove"],
    mutationFn: async (params) =>
      authFetch.get("RemoveSavedSearch", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] }),
  });

  return {
    removeSavedSearch: mutateAsync,
    isRemovingSavedSearch: isPending,
  };
};
