import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemoveLocalRepositoryParams {
  name: string;
}

export const useRemoveLocalRepository = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveLocalRepositoryParams
  >({
    mutationKey: ["locals", "delete"],
    mutationFn: async ({ name }) => authFetch.delete(`locals/${name}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals"] }),
  });

  return {
    removeLocalRepository: mutateAsync,
    isRemovingLocalRepository: isPending,
  };
};
