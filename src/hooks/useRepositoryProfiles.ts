import useFetch from "./useFetch";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { RepositoryProfile } from "../types/RepositoryProfile";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { QueryFnType } from "../types/QueryFnType";
import { ApiError } from "../types/ApiError";

interface GetRepositoryProfilesParams {
  names?: string[];
}

interface CreateRepositoryProfileParams {
  title: string;
  description?: string;
  access_group?: string;
}

interface RemoveRepositoryProfileParams {
  name: string;
}

interface UseRepositoryProfilesResult {
  getRepositoryProfilesQuery: QueryFnType<
    AxiosResponse<RepositoryProfile[]>,
    GetRepositoryProfilesParams
  >;

  createRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    CreateRepositoryProfileParams
  >;

  removeRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveRepositoryProfileParams
  >;
}

export default function useRepositoryProfiles(): UseRepositoryProfilesResult {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const debug = useDebug();

  const getRepositoryProfilesQuery: QueryFnType<
    AxiosResponse<RepositoryProfile[]>,
    GetRepositoryProfilesParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<RepositoryProfile[]>, AxiosError<ApiError>>({
      queryKey: ["repositoryProfiles"],
      queryFn: () =>
        authFetch!
          .get("GetRepositoryProfiles", {
            params: queryParams,
          })
          .then(({ data }) => data ?? [])
          .catch(debug),
      ...config,
    });

  const createRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    CreateRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!.get("CreateRepositoryProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  const removeRepositoryProfileQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) => authFetch!.get("RemovePackageProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  return {
    getRepositoryProfilesQuery,
    createRepositoryProfileQuery,
    removeRepositoryProfileQuery,
  };
}
