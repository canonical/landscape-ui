import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemovePublicationParams {
  name: string;
}

export default function useRemovePublication() {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const removePublicationQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePublicationParams
  >({
    mutationKey: ["publications", "remove"],
    mutationFn: async (params) =>
      authFetchOld.get("RemovePublication", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    removePublicationQuery,
  };
}
