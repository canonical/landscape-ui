import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { AutoinstallFile } from "../types";

interface UpdateAutoinstallFileParams {
  id: number;
  contents?: string;
  is_default?: boolean;
}

const useUpdateAutoinstallFile = (): {
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
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return {
    isAutoinstallFileUpdating: isPending,
    updateAutoinstallFile: mutateAsync,
  };
};

export default useUpdateAutoinstallFile;
