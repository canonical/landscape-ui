import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemoveRepositoryPackagesParams {
  name: string;
  packages: string[];
}

export const useRemoveRepositoryPackages = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveRepositoryPackagesParams
  >({
    mutationKey: ["locals", "packages", "delete"],
    mutationFn: async ({ name, ...params }) => authFetchDebArchive.delete(`${name}/packages`, { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals", "packages"] }),
  });

  return {
    removeRepositoryPackages: mutateAsync,
    isRemovingRepositoryPackages: isPending,
  };
};
