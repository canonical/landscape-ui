import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { Instance } from "@/types/Instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface EditInstanceParams {
  instanceId: number;
  access_group?: string;
  comment?: string;
  tags?: string[];
  title?: string;
}

export const useEditInstance = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Instance>,
    AxiosError<ApiError>,
    EditInstanceParams
  >({
    mutationFn: async ({ instanceId, ...params }) =>
      authFetch.put(`computers/${instanceId}`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
        queryClient.invalidateQueries({ queryKey: ["instanceTags"] }),
      ]),
  });

  return {
    editInstance: mutateAsync,
    isEditingInstance: isPending,
  };
};
