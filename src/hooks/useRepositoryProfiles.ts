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

interface EditRepositoryProfileParams {
  name: string;
  title?: string;
  description?: string;
}

interface AssociationRepositoryProfileParams {
  name: string;
  tags?: string[];
  all_computers?: boolean;
}

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

  editRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    EditRepositoryProfileParams
  >;

  associateRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    AssociationRepositoryProfileParams
  >;

  disassociateRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    AssociationRepositoryProfileParams
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
        authFetch!.get("GetRepositoryProfiles", {
          params: queryParams,
        }),
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

  const editRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    EditRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) => authFetch!.get("EditRepositoryProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  const associateRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    AssociationRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!.get("AssociateRepositoryProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  const disassociateRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    AssociationRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!.get("DisassociateRepositoryProfile", { params }),
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
    mutationFn: (params) =>
      authFetch!.get("RemoveRepositoryProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  return {
    getRepositoryProfilesQuery,
    createRepositoryProfileQuery,
    removeRepositoryProfileQuery,
    associateRepositoryProfileQuery,
    editRepositoryProfileQuery,
    disassociateRepositoryProfileQuery,
  };
}
