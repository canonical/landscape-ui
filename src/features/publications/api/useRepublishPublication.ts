import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RepublishPublicationParams {
  name: string;
}

export default function useRepublishPublication() {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const republishPublicationQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RepublishPublicationParams
  >({
    mutationKey: ["publications", "republish"],
    mutationFn: async (params) =>
      authFetchOld.get("RepublishPublication", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    republishPublicationQuery,
  };
}
