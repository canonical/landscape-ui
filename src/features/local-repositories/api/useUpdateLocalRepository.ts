import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  UpdateLocalData,
  UpdateLocalError,
  UpdateLocalResponse,
} from "@canonical/landscape-openapi";

export const useUpdateLocalRepository = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<UpdateLocalResponse>,
    AxiosError<UpdateLocalError>,
    UpdateLocalData["body"] & { name: string }
  >({
    mutationKey: ["local", "update"],
    mutationFn: async ({ name, ...local }) =>
      authFetchDebArchive.patch(name, local),
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locals"] });
      queryClient.invalidateQueries({ queryKey: ["local", variables.name] });
    },
  });

  return {
    updateRepository: mutateAsync,
    isUpdatingRepository: isPending,
  };
};
