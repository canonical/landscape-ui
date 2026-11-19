import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { HealthRulesResponse } from "../types";

const FIVE_MINUTES = 300_000;

/** Returns the effective rules, disabled ones included. */
export default function useHealthRules() {
  const authFetch = useFetch();
  return useQuery<AxiosResponse<HealthRulesResponse>, AxiosError<ApiError>>({
    queryKey: ["health", "rules"],
    queryFn: async () =>
      authFetch.get("health/rules", { params: { include_disabled: true } }),
    staleTime: FIVE_MINUTES,
  });
}
