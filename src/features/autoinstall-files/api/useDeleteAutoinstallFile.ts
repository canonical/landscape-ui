import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface DeleteAutoinstallFileParams {
  id: number;
}

const useDeleteAutoinstallFile = (): {
  deleteAutoinstallFile: (params: DeleteAutoinstallFileParams) => Promise<null>;
  isAutoinstallFileUpdating: boolean;
} => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    null,
    AxiosError<ApiError>,
    DeleteAutoinstallFileParams
  >({
    mutationFn: async ({ id }) => authFetch.delete(`autoinstall/${id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return {
    deleteAutoinstallFile: mutateAsync,
    isAutoinstallFileUpdating: isPending,
  };
};

export default useDeleteAutoinstallFile;
