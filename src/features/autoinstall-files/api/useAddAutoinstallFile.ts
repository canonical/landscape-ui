import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { AutoinstallFile } from "../types";

interface AddAutoinstallFileParams {
  contents: string;
  filename: string;
}

const useAddAutoinstallFile = (): {
  isAutoinstallFileAdding: boolean;
  addAutoinstallFile: (
    params: AddAutoinstallFileParams,
  ) => Promise<AutoinstallFile>;
} => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AutoinstallFile,
    AxiosError<ApiError>,
    AddAutoinstallFileParams
  >({
    mutationFn: (params) => authFetch.post("autoinstall", params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return {
    isAutoinstallFileAdding: isPending,
    addAutoinstallFile: mutateAsync,
  };
};

export default useAddAutoinstallFile;
