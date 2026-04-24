import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemoveLocalRepositoryParams {
  name: string;
}

export const useRemoveLocalRepository = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveLocalRepositoryParams
  >({
    mutationKey: ["locals", "delete"],
    mutationFn: async ({ name }) => authFetchDebArchive.delete(name),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals"] }),
  });

  return {
    removeRepository: mutateAsync,
    isRemovingRepository: isPending,
  };
};
