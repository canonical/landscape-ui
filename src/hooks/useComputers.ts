import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "./useFetch";
import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { Computer } from "../types/Computer";
import { ApiError } from "../types/ApiError";
import useDebug from "./useDebug";

export interface GetComputersParams {
  query?: string;
  limit?: string;
  offset?: string;
  with_network?: boolean;
  with_hardware?: boolean;
  with_annotations?: boolean;
}

export interface AddAnnotationToComputersParams {
  query: string;
  key: string;
  value?: string;
}

export interface RemoveAnnotationFromComputersParams {
  query: string;
  key: string;
}

export interface AddTagsToComputersParams {
  query: string;
  tags: string[];
}

export interface RemoveTagsFromComputersParams {
  query: string;
  tags: string[];
}

export interface ChangeComputerAccessGroupParams {
  query: string;
  access_group: string;
}

export interface RemoveComputers {
  computer_ids: string[];
}

export interface AcceptPendingComputersParams {
  computer_ids: string[];
  access_group?: string;
}

export interface RejectPendingComputersParams {
  computer_ids: string[];
}

export interface CreateCloudOtpsParams {
  count: number;
}

export interface RebootComputersParams {
  computer_ids: string[];
  deliver_after?: string; // YYYY-MM-DDTHH:MM:SSZ
}

export interface ShutdownComputersParams {
  computer_ids: string[];
  deliver_after?: string; // YYYY-MM-DDTHH:MM:SSZ
}

export interface RenameComputersParams {
  computer_titles: string[]; // id:new_title
}

export const useComputers = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const debug = useDebug();

  const getComputersQuery: QueryFnType<
    AxiosResponse<Computer[]>,
    GetComputersParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<Computer[]>, AxiosError<ApiError>>({
      queryKey: ["computers", { ...queryParams }],
      queryFn: () =>
        authFetch!.get("GetComputers", {
          params: queryParams,
        }),
      ...config,
    });

  const addAnnotationToComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    AddAnnotationToComputersParams
  >({
    mutationKey: ["computers", "annotation", "add"],
    mutationFn: (params) =>
      authFetch!.get("AddAnnotationToComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const removeAnnotationFromComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    RemoveAnnotationFromComputersParams
  >({
    mutationKey: ["computers", "annotation", "remove"],
    mutationFn: (params) =>
      authFetch!.get("RemoveAnnotationFromComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const addTagsToComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    AddTagsToComputersParams
  >({
    mutationKey: ["computers", "tags", "add"],
    mutationFn: (params) => authFetch!.get("AddTagsToComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const removeTagsFromComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    RemoveTagsFromComputersParams
  >({
    mutationKey: ["computers", "tags", "remove"],
    mutationFn: (params) =>
      authFetch!.get("RemoveTagsFromComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const changeComputerAccessGroup = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    ChangeComputerAccessGroupParams
  >({
    mutationKey: ["computers", "access_group", "change"],
    mutationFn: (params) =>
      authFetch!.get("ChangeComputerAccessGroup", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const removeComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    RemoveComputers
  >({
    mutationKey: ["computers", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const getPendingComputers: QueryFnType<
    AxiosResponse<Computer[]>,
    undefined
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<Computer[]>, AxiosError<ApiError>>({
      queryKey: ["computers", "pending"],
      queryFn: () => authFetch!.get("GetPendingComputers"),
      ...config,
    });

  const acceptPendingComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    AcceptPendingComputersParams
  >({
    mutationKey: ["computers", "pending", "accept"],
    mutationFn: (params) =>
      authFetch!.get("AcceptPendingComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const rejectPendingComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    RejectPendingComputersParams
  >({
    mutationKey: ["computers", "pending", "reject"],
    mutationFn: (params) =>
      authFetch!.get("RejectPendingComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const createCloudOtps = useMutation<
    AxiosResponse<string[]>,
    AxiosError<ApiError>,
    CreateCloudOtpsParams
  >({
    mutationKey: ["computers", "cloud_otps", "create"],
    mutationFn: (params) => authFetch!.get("CreateCloudOtps", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const rebootComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    RebootComputersParams
  >({
    mutationKey: ["computers", "reboot"],
    mutationFn: (params) => authFetch!.get("RebootComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const shutdownComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    ShutdownComputersParams
  >({
    mutationKey: ["computers", "shutdown"],
    mutationFn: (params) => authFetch!.get("ShutdownComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const renameComputers = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    RenameComputersParams
  >({
    mutationKey: ["computers", "rename"],
    mutationFn: (params) => authFetch!.get("RenameComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  return {
    getComputersQuery,
    addAnnotationToComputers,
    removeAnnotationFromComputers,
    addTagsToComputers,
    removeTagsFromComputers,
    changeComputerAccessGroup,
    removeComputers,
    getPendingComputers,
    acceptPendingComputers,
    rejectPendingComputers,
    createCloudOtps,
    rebootComputers,
    shutdownComputers,
    renameComputers,
  };
};
