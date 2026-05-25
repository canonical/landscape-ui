import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { USGProfile } from "../types";

export interface ArchiveUSGProfileParams {
  id: number;
}

export const useArchiveUsgProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    USGProfile,
    AxiosError<ApiError>,
    ArchiveUSGProfileParams
  >({
    mutationFn: async ({ id }) => authFetch.post(`usg-profiles/${id}:archive`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["usgProfiles"] }),
  });

  return {
    isArchivingUsgProfile: isPending,
    archiveUsgProfile: mutateAsync,
  };
};
