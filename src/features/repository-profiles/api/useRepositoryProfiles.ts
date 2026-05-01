import type { Activity } from "@/features/activities";
import type { APTSource } from "../types";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RepositoryProfile } from "../types";

interface GetRepositoryProfilesParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CreateRepositoryProfileParams {
  title: string;
  access_group?: string;
  all_computers?: boolean;
  apt_sources?: APTSource[];
  description?: string;
  tags?: string[];
}

interface EditRepositoryProfileParams {
  name: string;
  all_computers?: boolean;
  add_apt_sources?: APTSource[];
  remove_apt_sources?: number[];
  description?: string;
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
    mutationFn: async ({ apt_sources, tags, ...rest }) => {
      const normalizedTags = tags ?? [];
      return authFetch.post("repositoryprofiles", {
        ...rest,
        tags: normalizedTags,
        apt_sources: apt_sources?.map(
          ({ name: sourceName, line, gpg_key }) => ({
            name: sourceName,
            line,
            gpg_key: gpg_key ? { content: gpg_key } : null,
          }),
        ),
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["aptSources"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] });
    },
  });

  const editRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    EditRepositoryProfileParams
  >({
    mutationFn: async ({ name, add_apt_sources, tags, ...rest }) => {
      const normalizedTags = tags ?? [];
      return authFetch.put(`repositoryprofiles/${name}`, {
        ...rest,
        tags: normalizedTags,
        add_apt_sources: add_apt_sources?.map(
          ({ name: sourceName, line, gpg_key }) => ({
            name: sourceName,
            line,
            gpg_key: gpg_key ? { content: gpg_key } : null,
          }),
        ),
      });
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["aptSources"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({ queryKey: ["repositoryProfiles"] });
      await queryClient.invalidateQueries({
        queryKey: ["repositoryProfile", variables.name],
      });
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
