import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const useDeleteAutoinstallFile = (): {
  deleteAutoinstallFile: (id: number) => Promise<null>;
  isAutoinstallFileUpdating: boolean;
} => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    null,
    AxiosError<ApiError>,
    { id: number }
  >({
    mutationFn: async ({ id }) => authFetch.delete(`autoinstall/${id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return {
    deleteAutoinstallFile: async (id: number): Promise<null> => {
      return mutateAsync({ id });
    },
    isAutoinstallFileUpdating: isPending,
  };
};

export default useDeleteAutoinstallFile;
