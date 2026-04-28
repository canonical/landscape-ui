import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  DeleteLocalError,
  DeleteLocalData,
} from "@canonical/landscape-openapi";

export const useRemoveLocalRepository = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<DeleteLocalError>,
    DeleteLocalData["path"]
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
