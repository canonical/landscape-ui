import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UpgradeProfile,
  UpgradeProfileDay,
  UpgradeProfileFrequency,
  UpgradeProfileType,
} from "../types";
import useFetchOld from "@/hooks/useFetchOld";
import { Activity } from "@/features/activities";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";

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
    mutationFn: (params) => {
      return authFetchOld!.get("CreateUpgradeProfile", { params });
    },
    onSuccess: () => queryClient.invalidateQueries(["upgradeProfiles"]),
  });

  const editUpgradeProfileQuery = useMutation<
    AxiosResponse<UpgradeProfile>,
    AxiosError<ApiError>,
    EditUpgradeProfileParams
  >({
    mutationFn: (params) => {
      return authFetchOld!.get("EditUpgradeProfile", { params });
    },
    onSuccess: () => queryClient.invalidateQueries(["upgradeProfiles"]),
  });

  const removeUpgradeProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUpgradeProfileParams
  >({
    mutationFn: (params) => {
      return authFetchOld!.get("RemoveUpgradeProfile", { params });
    },
    onSuccess: () => queryClient.invalidateQueries(["upgradeProfiles"]),
  });

  const getUpgradeProfilesQuery: QueryFnType<
    AxiosResponse<UpgradeProfile[]>,
    GetUpgradeProfilesParams
  > = (params = {}, config = {}) =>
    useQuery<AxiosResponse<UpgradeProfile[]>, AxiosError<ApiError>>({
      queryKey: ["upgradeProfiles", params],
      queryFn: () => authFetchOld!.get("GetUpgradeProfiles", { params }),
      ...config,
    });

  return {
    createUpgradeProfileQuery,
    editUpgradeProfileQuery,
    removeUpgradeProfileQuery,
    getUpgradeProfilesQuery,
  };
}
