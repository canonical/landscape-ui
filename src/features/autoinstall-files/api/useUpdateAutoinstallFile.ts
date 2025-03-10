import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { AutoinstallFile } from "../types";

interface UpdateAutoinstallFileParams {
  contents?: string;
  is_default?: boolean;
}

const useUpdateAutoinstallFile = (): {
  updateAutoinstallFile: (
    id: number,
    params: UpdateAutoinstallFileParams,
  ) => Promise<AutoinstallFile>;
  isAutoinstallFileUpdating: boolean;
} => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AutoinstallFile,
    AxiosError<ApiError>,
    { id: number } & UpdateAutoinstallFileParams
  >({
    mutationFn: async ({ id, ...params }) =>
      authFetch.patch(`autoinstall/${id}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return {
    isAutoinstallFileUpdating: isPending,
    updateAutoinstallFile: async (
      id: number,
      params: UpdateAutoinstallFileParams,
    ): Promise<AutoinstallFile> => {
      return mutateAsync({ id, ...params });
    },
  };
};

export default useUpdateAutoinstallFile;
