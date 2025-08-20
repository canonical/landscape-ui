import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PackageProfile } from "../types";

export interface UseGetPackageProfileParams {
  name: string;
}

export const useGetPackageProfile = (name: string) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<
    AxiosResponse<{ result: [PackageProfile] }>,
    AxiosError<ApiError>
  >({
    queryKey: ["packageProfile", name],
    queryFn: async ({ signal }) =>
      authFetch.get("packageprofiles", {
        params: { names: [name] },
        signal,
      }),
  });

  const packageProfile = response?.data.result[0];

  return {
    packageProfile,
    packageProfileError:
      response && !packageProfile
        ? new Error("The package profile could not be found.")
        : error,
    isGettingPackageProfile: isPending,
  };
};
