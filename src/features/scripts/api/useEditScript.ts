import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface EditScriptParams {
  script_id: number;
  code?: string;
  time_limit?: number;
  title?: string;
  username?: string;
}

export const useEditScript = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    EditScriptParams
  >({
    mutationKey: ["scripts", "edit"],
    mutationFn: async (params) => authFetch.get("EditScript", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  return {
    editScript: mutateAsync,
    isEditing: isPending,
  };
};
