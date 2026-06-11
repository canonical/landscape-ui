import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ComputerHealth } from "../types";

export default function useComputerHealth(computerId: number) {
  const authFetch = useFetch();
  return useQuery<AxiosResponse<ComputerHealth>, AxiosError<ApiError>>({
    queryKey: ["health", "computer", computerId],
    queryFn: async () => authFetch.get(`computers/${computerId}/health`),
    enabled: Number.isFinite(computerId) && computerId > 0,
  });
}
