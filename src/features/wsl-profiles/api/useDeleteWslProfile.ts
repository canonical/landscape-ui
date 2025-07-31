import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface DeleteWslProfileParams {
  name: string;
}

export const useDeleteWslProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    DeleteWslProfileParams
  >({
    mutationFn: async ({ name }) =>
      authFetch.delete(`child-instance-profiles/${name}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["wslProfiles"] }),
  });

  return {
    deleteWslProfile: mutateAsync,
    isDeletingWslProfile: isPending,
  };
};
