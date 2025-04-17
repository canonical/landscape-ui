import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SingleScript } from "../types";

export const useGetSingleScript = (scriptId: SingleScript["id"]) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<SingleScript>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", scriptId],
    queryFn: async () => authFetch.get(`scripts/${scriptId}`),
  });

  return {
    script: response?.data ?? null,
    isScriptLoading: isLoading,
  };
};
