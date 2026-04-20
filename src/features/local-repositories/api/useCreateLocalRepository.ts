import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { LocalRepository } from "../types";

interface CreateLocalRepositoryParams {
  display_name: string,
  comment?: string,
  distribution: string,
  component: string,
}

export const useCreateLocalRepository = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<LocalRepository>,
    AxiosError<ApiError>,
    CreateLocalRepositoryParams
  >({
    mutationKey: ["local", "create"],
    mutationFn: async (params) => authFetchDebArchive.post("locals", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals"] }),
  });

  return {
    createRepository: mutateAsync,
    isCreatingRepository: isPending,
  };
};
