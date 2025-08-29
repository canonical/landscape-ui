import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { AutoinstallFile } from "../types";

export interface ValidateAutoinstallFileParams {
  contents: string;
}

export const useValidateAutoinstallFile = (): {
  validateAutoinstallFile: (
    params: ValidateAutoinstallFileParams,
  ) => Promise<AutoinstallFile>;
  isAutoinstallFileValidating: boolean;
} => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AutoinstallFile,
    AxiosError<ApiError>,
    ValidateAutoinstallFileParams
  >({
    mutationFn: async (params) =>
      authFetch.post(`autoinstall:validate`, params),
  });

  return {
    isAutoinstallFileValidating: isPending,
    validateAutoinstallFile: mutateAsync,
  };
};
