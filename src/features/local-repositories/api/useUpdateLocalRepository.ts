import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { LocalRepository } from "../types";

interface UpdateLocalRepositoryParams {
  readonly local: Partial<LocalRepository> & Required<Pick<LocalRepository, "name">>;
  readonly field_mask?: string[];
}

export const useUpdateLocalRepository = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<LocalRepository>,
    AxiosError<ApiError>,
    UpdateLocalRepositoryParams
  >({
    mutationKey: ["local", "update"],
    mutationFn: async (params) =>
      authFetchDebArchive.patch(params.local.name, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals"] }),
  });

  return {
    updateRepository: mutateAsync,
    isUpdatingRepository: isPending,
  };
};
