import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useRemoveScript = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    never,
    AxiosError<ApiError>,
    number
  >({
    mutationKey: ["scripts", "remove"],
    mutationFn: async (id) => authFetch.post(`scripts/${id}:redact`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  return {
    removeScript: mutateAsync,
    isRemovingScript: isPending,
  };
};
