import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  UpgradeProfile,
  UpgradeProfileDay,
  UpgradeProfileFrequency,
  UpgradeProfileType,
} from "../types";

export interface CreateUpgradeProfileParams {
  every: UpgradeProfileFrequency;
  title: string;
  upgrade_type: UpgradeProfileType;
  access_group?: string;
  all_computers?: boolean;
  at_hour?: number;
  at_minute?: number;
  autoremove?: boolean;
  deliver_delay_window?: `${number}`;
  deliver_within?: number;
  on_days?: UpgradeProfileDay[];
  tags?: string[];
}

interface EditUpgradeProfileParams
  extends Omit<CreateUpgradeProfileParams, "title"> {
  name: string;
  title?: string;
}

interface RemoveUpgradeProfileParams {
  name: string;
}

interface GetUpgradeProfilesParams {
  upgrade_type?: UpgradeProfileType;
}

export default function useUpgradeProfiles() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();

  const createUpgradeProfileQuery = useMutation<
    AxiosResponse<UpgradeProfile>,
    AxiosError<ApiError>,
    CreateUpgradeProfileParams
  >({
    mutationFn: async (params) => {
      return authFetchOld.get("CreateUpgradeProfile", { params });
    },
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["upgradeProfiles"] }),
  });

  const editUpgradeProfileQuery = useMutation<
    AxiosResponse<UpgradeProfile>,
    AxiosError<ApiError>,
    EditUpgradeProfileParams
  >({
    mutationFn: async (params) => {
      return authFetchOld.get("EditUpgradeProfile", { params });
    },
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["upgradeProfiles"] }),
  });

  const removeUpgradeProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUpgradeProfileParams
  >({
    mutationFn: async (params) => {
      return authFetchOld.get("RemoveUpgradeProfile", { params });
    },
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["upgradeProfiles"] }),
  });

  const getUpgradeProfilesQuery: QueryFnType<
    AxiosResponse<UpgradeProfile[]>,
    GetUpgradeProfilesParams
  > = (params = {}, config = {}) =>
    useQuery<AxiosResponse<UpgradeProfile[]>, AxiosError<ApiError>>({
      queryKey: ["upgradeProfiles", params],
      queryFn: async () => authFetchOld.get("GetUpgradeProfiles", { params }),
      ...config,
    });

  return {
    createUpgradeProfileQuery,
    editUpgradeProfileQuery,
    removeUpgradeProfileQuery,
    getUpgradeProfilesQuery,
  };
}
