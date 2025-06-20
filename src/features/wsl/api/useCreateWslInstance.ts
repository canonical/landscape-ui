import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface CreateWslInstanceParams {
  computer_name: string;
  parent_id: number;
  rootfs_url?: string;
  cloud_init?: string;
}

export const useCreateWslInstance = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateWslInstanceParams
  >({
    mutationFn: async ({ parent_id, ...params }) =>
      authFetch.post(`computers/${parent_id}/children`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  return {
    isCreatingWslInstance: isPending,
    createWslInstance: mutateAsync,
  };
};
