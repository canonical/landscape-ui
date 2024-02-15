import useFetchOld from "./useFetchOld";
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
  description?: string;
  title?: string;
}

interface AssociationRepositoryProfileParams {
  name: string;
  all_computers?: boolean;
  tags?: string[];
}

interface GetRepositoryProfilesParams {
  names?: string[];
}

interface CreateRepositoryProfileParams {
  title: string;
  access_group?: string;
  description?: string;
}

interface RemoveRepositoryProfileParams {
  name: string;
}

interface AddAPTSourcesToRepositoryProfileParams {
  apt_sources: string[];
  name: string;
}

interface RemoveAPTSourceFromRepositoryProfileParams {
  apt_source: string;
  name: string;
}

interface RepositoryProfilePocketActionParams {
  distribution: string;
  name: string;
  pockets: string[];
  series: string;
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

  addAPTSourcesToRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    AddAPTSourcesToRepositoryProfileParams
  >;

  removeAPTSourceFromRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    RemoveAPTSourceFromRepositoryProfileParams
  >;

  addPocketsToRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    RepositoryProfilePocketActionParams
  >;

  removePocketsFromRepositoryProfileQuery: UseMutationResult<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    RepositoryProfilePocketActionParams
  >;
}

export default function useRepositoryProfiles(): UseRepositoryProfilesResult {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();
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

  const addAPTSourcesToRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    AddAPTSourcesToRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!.get("AddAPTSourcesToRepositoryProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  const removeAPTSourceFromRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    RemoveAPTSourceFromRepositoryProfileParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!.get("RemoveAPTSourceFromRepositoryProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  const addPocketsToRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    RepositoryProfilePocketActionParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!.get("AddPocketsToRepositoryProfile", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["repositoryProfiles"]).catch(debug);
    },
  });

  const removePocketsFromRepositoryProfileQuery = useMutation<
    AxiosResponse<RepositoryProfile>,
    AxiosError<ApiError>,
    RepositoryProfilePocketActionParams
  >({
    mutationKey: ["repositoryProfiles"],
    mutationFn: (params) =>
      authFetch!.get("RemovePocketsFromRepositoryProfile", { params }),
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
    addAPTSourcesToRepositoryProfileQuery,
    removeAPTSourceFromRepositoryProfileQuery,
    addPocketsToRepositoryProfileQuery,
    removePocketsFromRepositoryProfileQuery,
  };
}
