import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface ReapplyWslProfileParams {
  name: string;
  computer_ids?: number[];
}

export const useReapplyWslProfile = () => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ReapplyWslProfileParams
  >({
    mutationFn: async ({ name }) =>
      authFetch.post(`child-instance-profiles/${name}:reapply`),
  });

  return {
    reapplyWslProfile: mutateAsync,
    isReapplyingWslProfile: isPending,
  };
};
