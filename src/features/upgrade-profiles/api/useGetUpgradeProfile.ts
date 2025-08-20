import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { UpgradeProfile } from "../types";

export const useGetUpgradeProfile = (id: number) => {
  const authFetchOld = useFetchOld();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<UpgradeProfile[]>, AxiosError<ApiError>>({
    queryKey: ["upgradeProfile", id],
    queryFn: async ({ signal }) =>
      authFetchOld.get("GetUpgradeProfiles", { signal }),
  });

  const upgradeProfile = response?.data.find(
    ({ id: upgradeProfileId }) => upgradeProfileId === id,
  );

  return {
    upgradeProfile,
    upgradeProfileError:
      response && !upgradeProfile
        ? new Error("The upgrade profile could not be found.")
        : error,
    isGettingUpgradeProfile: isPending,
  };
};
