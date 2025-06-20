import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslInstanceType } from "../types";

export const useGetWslInstanceTypes = () => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<WslInstanceType[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["wsl-instance-names"],
    queryFn: async () => authFetch.get("wsl-instance-names"),
  });

  return {
    wslInstanceTypes: response?.data ?? [],
    isGettingWslInstanceTypes: isPending,
  };
};
