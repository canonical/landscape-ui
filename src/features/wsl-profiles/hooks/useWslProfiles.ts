import { QueryFnType } from "@/types/QueryFnType";
import { WslProfile } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

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
      queryFn: () => authFetch!.get("child-instance-profiles"),
      ...config,
    });
  };

  const createWslProfileQuery = useMutation<
    AxiosResponse<WslProfile>,
    AxiosError<ApiError>,
    CreateWslProfileParams
  >({
    mutationFn: (params) => authFetch!.post("child-instance-profiles", params),
    onSuccess: () => queryClient.invalidateQueries(["wslProfiles"]),
  });

  const removeWslProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveWslProfileParams
  >({
    mutationFn: ({ name }) =>
      authFetch!.delete(`child-instance-profiles/${name}`),
    onSuccess: () => queryClient.invalidateQueries(["wslProfiles"]),
  });

  const editWslProfileQuery = useMutation<
    AxiosResponse<WslProfile>,
    AxiosError<ApiError>,
    EditWslProfileParams
  >({
    mutationFn: ({ name, ...params }) =>
      authFetch!.patch(`child-instance-profiles/${name}`, params),
    onSuccess: () => queryClient.invalidateQueries(["wslProfiles"]),
  });

  return {
    createWslProfileQuery,
    editWslProfileQuery,
    getWslProfilesQuery,
    removeWslProfileQuery,
  };
}
