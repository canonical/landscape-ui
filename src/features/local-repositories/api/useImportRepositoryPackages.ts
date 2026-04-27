import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  ImportLocalPackagesError,
  ImportLocalPackagesData,
  LocalServiceImportLocalPackagesBody,
  ImportLocalPackagesResponse,
} from "@canonical/landscape-openapi";

export const useImportRepositoryPackages = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<ImportLocalPackagesResponse>,
    AxiosError<ImportLocalPackagesError>,
    LocalServiceImportLocalPackagesBody & ImportLocalPackagesData["path"]
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
