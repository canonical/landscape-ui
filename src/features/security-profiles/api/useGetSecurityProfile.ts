import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SecurityProfile } from "../types";

export const useGetSecurityProfile = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<SecurityProfile>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["securityProfile", id],
    queryFn: async ({ signal }) =>
      authFetch.get("security-profiles", { signal }),
    ...options,
  });

  const securityProfile = response?.data.results.find(
    ({ id: securityProfileId }) => securityProfileId === id,
  );

  return {
    securityProfile: securityProfile,
    securityProfileError:
      response && !securityProfile
        ? new Error("The security profile could not be found.")
        : error,
    isGettingSecurityProfile: isPending,
  };
};
