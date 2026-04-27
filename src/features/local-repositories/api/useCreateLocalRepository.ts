import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  LocalWritable,
  CreateLocalError,
  CreateLocalResponse,
} from "@canonical/landscape-openapi";

export const useCreateLocalRepository = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<CreateLocalResponse>,
    AxiosError<CreateLocalError>,
    LocalWritable
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
