import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const useRemoveAutoinstallFile = (): ((id: number) => Promise<null>) => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    null,
    AxiosError<ApiError>,
    { id: number }
  >({
    mutationFn: ({ id }) => authFetch.delete(`autoinstall/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return (id: number) => {
    return mutateAsync({ id });
  };
};

export default useRemoveAutoinstallFile;
