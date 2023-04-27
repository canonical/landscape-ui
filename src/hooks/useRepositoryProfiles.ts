import useFetch from "./useFetch";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { RepositoryProfile } from "../types/RepositoryProfile";
import useDebug from "./useDebug";
import { AxiosError } from "axios";
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

interface UseRepositoryProfilesResult {
  getRepositoryProfilesQuery: QueryFnType<
    RepositoryProfile[],
    GetRepositoryProfilesParams
  >;

  createRepositoryProfileQuery: UseMutationResult<
    RepositoryProfile,
    AxiosError<ApiError>,
    CreateRepositoryProfileParams
  >;
}

export default function useRepositoryProfiles(): UseRepositoryProfilesResult {
  const authFetch = useFetch();
  const debug = useDebug();

  const getRepositoryProfilesQuery: QueryFnType<
    RepositoryProfile[],
    GetRepositoryProfilesParams
  > = (queryParams = {}, config = {}) =>
    // @ts-ignore
    useQuery<RepositoryProfile[], AxiosError<ApiError>>({
      // @ts-ignore
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
    RepositoryProfile,
    AxiosError<ApiError>,
    CreateRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!
        .post("CreateRepositoryProfile", params)
        .then(({ data }) => data)
        .catch(debug),
  });

  return { getRepositoryProfilesQuery, createRepositoryProfileQuery };
}
