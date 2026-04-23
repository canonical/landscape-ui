import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ImportLocalPackagesRequest, Task } from "../types";

export const useImportRepositoryPackages = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Task>,
    AxiosError<ApiError>,
    ImportLocalPackagesRequest
  >({
    mutationKey: ["locals", "packages", "import"],
    mutationFn: async ({ name, ...params }) =>
      authFetchDebArchive.post(`${name}:importPackages`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals", "packages"] }),
  });

  return {
    importRepositoryPackages: mutateAsync,
    isImportingRepositoryPackages: isPending,
  };
};
