import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  LocalServiceDeleteLocalData,
  LocalServiceDeleteLocalError,
} from "@canonical/landscape-openapi";

export const useRemoveLocalRepository = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<LocalServiceDeleteLocalError>,
    LocalServiceDeleteLocalData["path"]["local"]
  >({
    mutationKey: ["locals", "delete"],
    mutationFn: async (name) => authFetchDebArchive.delete(name),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["locals"] }),
  });

  return {
    removeRepository: mutateAsync,
    isRemovingRepository: isPending,
  };
};
