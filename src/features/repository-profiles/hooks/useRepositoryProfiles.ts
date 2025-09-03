import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RepositoryProfile } from "../types";

interface GetRepositoryProfilesParams {
  search?: string[];
}

export interface CreateRepositoryProfileParams {
  title: string;
  access_group?: string;
  all_computers?: boolean;
  apt_sources?: number[];
  description?: string;
  pockets?: number[];
  tags?: string[];
}

interface EditRepositoryProfileParams {
  name: string;
  access_group?: string;
  all_computers?: boolean;
  apt_sources?: number[];
  description?: string;
  pockets?: number[];
  tags?: string[];
  title?: string;
}

interface RemoveRepositoryProfileParams {
  name: string;
}

export default function useRepositoryProfiles() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const authFetchOld = useFetchOld();

  const getRepositoryProfilesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>,
    GetRepositoryProfilesParams
  > = (queryParams = {}, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>,
      AxiosError<ApiError>
    >({
      queryKey: ["repositoryProfiles", queryParams],
      queryFn: async () =>
        authFetch.get("repositoryprofiles", {
          params: queryParams,
        }),
      ...config,
    });

  const createRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    CreateRepositoryProfileParams
  >({
    mutationFn: async (params) => authFetch.post("repositoryprofiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] }),
  });

  const editRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    EditRepositoryProfileParams
  >({
    mutationFn: async ({ name, ...params }) =>
      authFetch.put(`repositoryprofiles/${name}`, params),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["aptSources"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] });
    },
  });

  const removeRepositoryProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: async (params) =>
      authFetchOld.get("RemoveRepositoryProfile", { params }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["aptSources"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] });
    },
  });

  return {
    getRepositoryProfilesQuery,
    createRepositoryProfileQuery,
    editRepositoryProfileQuery,
    removeRepositoryProfileQuery,
  };
}
