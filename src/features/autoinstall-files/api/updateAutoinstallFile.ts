import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { AutoinstallFile } from "../types";

interface UpdateAutoinstallFileParams {
  contents: string;
}

const useUpdateAutoinstallFile = (): ((
  id: number,
  params: UpdateAutoinstallFileParams,
) => Promise<AutoinstallFile>) => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    AutoinstallFile,
    AxiosError<ApiError>,
    { id: number } & UpdateAutoinstallFileParams
  >({
    mutationFn: ({ id, ...params }) =>
      authFetch.patch(`autoinstall/${id}`, params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return (id: number, params: UpdateAutoinstallFileParams) => {
    return mutateAsync({ id, ...params });
  };
};

export default useUpdateAutoinstallFile;
