import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { SecurityProfile } from "../types";

export interface ArchiveSecurityProfileParams {
  id: number;
}

export const useArchiveSecurityProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    SecurityProfile,
    AxiosError<ApiError>,
    ArchiveSecurityProfileParams
  >({
    mutationFn: async ({ id }) =>
      authFetch.post(`security-profiles/${id}:archive`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["securityProfiles"] }),
  });

  return {
    isArchivingSecurityProfile: isPending,
    archiveSecurityProfile: mutateAsync,
  };
};
