import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface RemoveAPTSourceParams {
  id: number;
  disassociate_profiles?: boolean;
}

export const useRemoveAPTSource = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    never,
    AxiosError<ApiError>,
    RemoveAPTSourceParams
  >({
    mutationKey: ["aptSources", "remove"],
    mutationFn: ({ id, ...params }) =>
      authFetch.delete(`repository/apt-source/${id}`, { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["aptSources"] }),
  });

  return {
    removeAPTSource: mutateAsync,
    isRemovingAPTSource: isPending,
  };
};
