import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@/features/activities";
import { RepositoryProfile } from "../types";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";

interface GetRepositoryProfilesParams {
  names?: string[];
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
      queryFn: () =>
        authFetch!.get("repositoryprofiles", {
          params: queryParams,
        }),
      ...config,
    });

  const createRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    CreateRepositoryProfileParams
  >({
    mutationFn: (params) => authFetch!.post("repositoryprofiles", params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] }),
  });

  const editRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    EditRepositoryProfileParams
  >({
    mutationFn: ({ name, ...params }) =>
      authFetch!.put(`repositoryprofiles/${name}`, params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] }),
  });

  const removeRepositoryProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetchOld!.get("RemoveRepositoryProfile", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] }),
  });

  return {
    getRepositoryProfilesQuery,
    createRepositoryProfileQuery,
    editRepositoryProfileQuery,
    removeRepositoryProfileQuery,
  };
}
