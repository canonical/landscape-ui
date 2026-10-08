import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useCancelOperation = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation<
    AxiosResponse<void>,
    AxiosError,
    string
  >({
    mutationKey: ["operations", "cancel"],
    mutationFn: async (name) => authFetchDebArchive.post(`${name}:cancel`),
    onSuccess: async (_, name) => {
      queryClient.invalidateQueries({ queryKey: ["operation", name] });
      queryClient.invalidateQueries({ queryKey: ["operations"] });
    },
  });

  return {
    cancelOperation: mutateAsync,
    isCancelingOperation: isPending,
    cancelOperationError: error,
  };
};
