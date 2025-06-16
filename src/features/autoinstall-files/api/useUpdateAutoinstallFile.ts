import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { AutoinstallFile } from "../types";

export interface UpdateAutoinstallFileParams {
  id: number;
  contents?: string;
  is_default?: boolean;
}

export const useUpdateAutoinstallFile = (): {
  updateAutoinstallFile: (
    params: UpdateAutoinstallFileParams,
  ) => Promise<AutoinstallFile>;
  isAutoinstallFileUpdating: boolean;
} => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AutoinstallFile,
    AxiosError<ApiError>,
    UpdateAutoinstallFileParams
  >({
    mutationFn: async ({ id, ...params }) =>
      authFetch.patch(`autoinstall/${id}`, params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] });
    },
  });

  return {
    isAutoinstallFileUpdating: isPending,
    updateAutoinstallFile: mutateAsync,
  };
};
