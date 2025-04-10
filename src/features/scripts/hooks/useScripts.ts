import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { Activity } from "@/features/activities";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/QueryFnType";
import type { Script } from "../types";

interface GetScriptsParams {
  limit?: number;
  offset?: number;
}

export interface GetScriptCodeParams {
  script_id: number;
}

export interface ExecuteScriptParams {
  query: string;
  script_id: number;
  username: string;
  // `YYYY-MM-DDTHH:MM:SSZ`
  deliver_after?: string;
}

interface RemoveScriptParams {
  script_id: number;
}

export interface CreateScriptParams {
  access_group: string;
  code: string;
  time_limit: number;
  title: string;
  username: string;
}

interface EditScriptParams {
  code: string;
  script_id: number;
  time_limit: number;
  title: string;
  username: string;
}

export interface CopyScriptParams {
  access_group: string;
  destination_title: string;
  script_id: number;
}

interface RemoveScriptAttachmentParams {
  filename: string;
  script_id: number;
}

export interface CreateScriptAttachmentParams {
  // <filename>$$<base64 encoded file contents>
  file: string;
  script_id: number;
}

export default function useScripts() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getScriptsQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Script>>,
    GetScriptsParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<ApiPaginatedResponse<Script>>, AxiosError<ApiError>>(
      {
        queryKey: ["scripts", queryParams],
        queryFn: async () => authFetch.get("scripts", { params: queryParams }),
        ...config,
      },
    );

  const getScriptCodeQuery: QueryFnType<
    AxiosResponse<string>,
    GetScriptCodeParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<string>, AxiosError<ApiError>>({
      queryKey: ["scriptCode", queryParams],
      queryFn: async () =>
        authFetchOld.get("GetScriptCode", { params: queryParams }),
      ...config,
    });

  const executeScriptQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ExecuteScriptParams
  >({
    mutationKey: ["scripts", "execute"],
    mutationFn: async (params) => authFetchOld.get("ExecuteScript", { params }),
  });

  const removeScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptParams
  >({
    mutationKey: ["scripts", "remove"],
    mutationFn: async (params) => authFetchOld.get("RemoveScript", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const createScriptQuery = useMutation<
    AxiosResponse<Script>,
    AxiosError<ApiError>,
    CreateScriptParams
  >({
    mutationKey: ["scripts", "create"],
    mutationFn: async (params) => authFetchOld.get("CreateScript", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const editScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    EditScriptParams
  >({
    mutationKey: ["scripts", "edit"],
    mutationFn: async (params) => authFetchOld.get("EditScript", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const copyScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    CopyScriptParams
  >({
    mutationKey: ["scripts", "copy"],
    mutationFn: async (params) => authFetchOld.get("CopyScript", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const removeScriptAttachmentQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptAttachmentParams
  >({
    mutationKey: ["scripts", "removeAttachment"],
    mutationFn: async (params) =>
      authFetchOld.get("RemoveScriptAttachment", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const createScriptAttachmentQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    CreateScriptAttachmentParams
  >({
    mutationKey: ["scripts", "createAttachment"],
    mutationFn: async (params) =>
      authFetchOld.get("CreateScriptAttachment", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  return {
    getScriptsQuery,
    getScriptCodeQuery,
    executeScriptQuery,
    removeScriptQuery,
    createScriptQuery,
    editScriptQuery,
    copyScriptQuery,
    removeScriptAttachmentQuery,
    createScriptAttachmentQuery,
  };
}
