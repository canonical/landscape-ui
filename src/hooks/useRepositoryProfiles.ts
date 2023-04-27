import useFetch from "./useFetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RepositoryProfile } from "../schemas/RepositoryProfile";
import useDebug from "./useDebug";
import { AxiosError } from "axios";
import { QueryFnType } from "../types/QueryFnType";
import { MutationFnType } from "../types/MutationFnType";
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
  createRepositoryProfileQuery: MutationFnType<
    RepositoryProfile,
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

  const createRepositoryProfileQuery: MutationFnType<
    RepositoryProfile,
    CreateRepositoryProfileParams
  > = (body, config) =>
    // @ts-ignore
    useMutation<RepositoryProfile[], AxiosError<ApiError>>({
      mutationKey: ["repositoryProfiles"],
      mutationFn: () =>
        authFetch!
          .post("CreateRepositoryProfile", body)
          .then(({ data }) => data)
          .catch(debug),
      ...config,
    });

  return { getRepositoryProfilesQuery, createRepositoryProfileQuery };
}
