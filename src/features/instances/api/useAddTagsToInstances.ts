import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { Instance } from "@/types/Instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface AddTagsToInstancesParams {
  query: string;
  tags: string[];
}

export const useAddTagsToInstances = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    AddTagsToInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("AddTagsToComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    addTagsToInstances: mutateAsync,
    isAddingTagsToInstances: isPending,
  };
};
