import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetchOld from "./useFetchOld";
import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { Computer } from "../types/Computer";
import { ApiError } from "../types/ApiError";
import useDebug from "./useDebug";
import { Activity } from "../types/Activity";

interface GetComputersParams {
  query?: string;
  limit?: number;
  offset?: number;
  with_network?: boolean;
  with_hardware?: boolean;
  with_grouped_hardware?: boolean;
  with_annotations?: boolean;
}

interface AddAnnotationToComputersParams {
  query: string;
  key: string;
  value?: string;
}

interface RemoveAnnotationFromComputersParams {
  query: string;
  key: string;
}

interface AddTagsToComputersParams {
  query: string;
  tags: string[];
}

interface RemoveTagsFromComputersParams {
  query: string;
  tags: string[];
}

interface ChangeComputersAccessGroupParams {
  query: string;
  access_group: string;
}

interface RemoveComputers {
  computer_ids: number[];
}

interface AcceptPendingComputersParams {
  computer_ids: number[];
  access_group?: string;
}

interface RejectPendingComputersParams {
  computer_ids: number[];
}

interface CreateCloudOtpsParams {
  count: number;
}

interface RebootComputersParams {
  computer_ids: number[];
  deliver_after?: string; // YYYY-MM-DDTHH:MM:SSZ
}

interface ShutdownComputersParams {
  computer_ids: number[];
  deliver_after?: string; // YYYY-MM-DDTHH:MM:SSZ
}

interface RenameComputersParams {
  computer_titles: string[]; // id:new_title
}

export default function useComputers() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();
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

  const addAnnotationToComputersQuery = useMutation<
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

  const removeAnnotationFromComputersQuery = useMutation<
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

  const addTagsToComputersQuery = useMutation<
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

  const removeTagsFromComputersQuery = useMutation<
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

  const changeComputersAccessGroupQuery = useMutation<
    AxiosResponse<Computer[]>,
    AxiosError<ApiError>,
    ChangeComputersAccessGroupParams
  >({
    mutationKey: ["computers", "access_group", "change"],
    mutationFn: (params) =>
      authFetch!.get("ChangeComputersAccessGroup", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const removeComputersQuery = useMutation<
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

  const getPendingComputersQuery: QueryFnType<
    AxiosResponse<Computer[]>,
    undefined
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<Computer[]>, AxiosError<ApiError>>({
      queryKey: ["computers", "pending"],
      queryFn: () => authFetch!.get("GetPendingComputers"),
      ...config,
    });

  const acceptPendingComputersQuery = useMutation<
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

  const rejectPendingComputersQuery = useMutation<
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

  const createCloudOtpsQuery = useMutation<
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

  const rebootComputersQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RebootComputersParams
  >({
    mutationKey: ["computers", "reboot"],
    mutationFn: (params) => authFetch!.get("RebootComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const shutdownComputersQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ShutdownComputersParams
  >({
    mutationKey: ["computers", "shutdown"],
    mutationFn: (params) => authFetch!.get("ShutdownComputers", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["computers"]).catch(debug);
    },
  });

  const renameComputersQuery = useMutation<
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
    addAnnotationToComputersQuery,
    removeAnnotationFromComputersQuery,
    addTagsToComputersQuery,
    removeTagsFromComputersQuery,
    changeComputersAccessGroupQuery,
    removeComputersQuery,
    getPendingComputersQuery,
    acceptPendingComputersQuery,
    rejectPendingComputersQuery,
    createCloudOtpsQuery,
    rebootComputersQuery,
    shutdownComputersQuery,
    renameComputersQuery,
  };
}
