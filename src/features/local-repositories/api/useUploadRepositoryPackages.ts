import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UploadRepositoryPackagesParams {
  name: string;
  source: string;
}

export const useUploadRepositoryPackages = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    UploadRepositoryPackagesParams
  >({
    mutationKey: ["locals", "packages", "upload"],
    mutationFn: async ({ name, ...params }) =>
      authFetchDebArchive.post(`${name}/uploads`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals", "packages"] }),
  });

  return {
    uploadRepositoryPackages: mutateAsync,
    isUploadingRepositoryPackages: isPending,
  };
};
