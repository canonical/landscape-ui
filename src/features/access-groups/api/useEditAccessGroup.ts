import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AccessGroup } from "../types";

interface EditAccessGroupParams {
  name: string;
  title: string;
}

export default function useEditAccessGroup() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const editAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    EditAccessGroupParams
  >({
    mutationKey: ["accessGroups", "edit"],
    mutationFn: async ({ name, title }) =>
      authFetch.patch(`access-groups/${name}`, { title }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["accessGroups"] }),
  });

  const { mutateAsync, isPending } = editAccessGroupQuery;

  return {
    editAccessGroup: mutateAsync,
    isEditingAccessGroup: isPending,
  };
}
