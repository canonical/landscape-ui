import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Script } from "../types";

export interface CreateScriptParams {
  code: string;
  title: string;
  access_group?: string;
}

export const useCreateScript = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Script>,
    AxiosError<ApiError>,
    CreateScriptParams
  >({
    mutationKey: ["scripts", "create"],
    mutationFn: async (params) => authFetch.get("CreateScript", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  return {
    createScript: mutateAsync,
    isCreatingScript: isPending,
  };
};
