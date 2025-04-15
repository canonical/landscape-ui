import type { QueryFnType } from "@/types/QueryFnType";
import type { WslProfile } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/api/ApiError";
import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";

export interface CreateWslProfileParams {
  description: string;
  title: string;
  image_name: string;
  image_source?: string;
  cloud_init_contents?: string;
  access_group?: string;
  all_computers?: boolean;
  tags?: string[];
}

export interface EditWslProfileParams {
  name: string;
  access_group?: string;
  all_computers?: boolean;
  description?: string;
  tags?: string[];
  title?: string;
}

interface RemoveWslProfileParams {
  name: string;
}

export default function useWslProfiles() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const getWslProfilesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<WslProfile>>,
    void
  > = (_, config = {}) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<WslProfile>>,
      AxiosError<ApiError>
    >({
      queryKey: ["wslProfiles"],
      queryFn: async () => authFetch.get("child-instance-profiles"),
      ...config,
    });
  };

  const createWslProfileQuery = useMutation<
    AxiosResponse<WslProfile>,
    AxiosError<ApiError>,
    CreateWslProfileParams
  >({
    mutationFn: async (params) =>
      authFetch.post("child-instance-profiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["wslProfiles"] }),
  });

  const removeWslProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveWslProfileParams
  >({
    mutationFn: async ({ name }) =>
      authFetch.delete(`child-instance-profiles/${name}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["wslProfiles"] }),
  });

  const editWslProfileQuery = useMutation<
    AxiosResponse<WslProfile>,
    AxiosError<ApiError>,
    EditWslProfileParams
  >({
    mutationFn: async ({ name, ...params }) =>
      authFetch.patch(`child-instance-profiles/${name}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["wslProfiles"] }),
  });

  return {
    createWslProfileQuery,
    editWslProfileQuery,
    getWslProfilesQuery,
    removeWslProfileQuery,
  };
}
