import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import { Activity } from "@/features/activities";
import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";
import { Script } from "../types";

interface GetScriptsParams {
  limit?: number;
  offset?: number;
}

interface GetScriptCodeParams {
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

interface CopyScriptParams {
  access_group: string;
  destination_title: string;
  script_id: number;
}

interface RemoveScriptAttachmentParams {
  filename: string;
  script_id: number;
}

interface CreateScriptAttachmentParams {
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
        queryFn: () => authFetch.get("scripts", { params: queryParams }),
        ...config,
      },
    );

  const getScriptCodeQuery: QueryFnType<
    AxiosResponse<string>,
    GetScriptCodeParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<string>, AxiosError<ApiError>>({
      queryKey: ["scriptCode", queryParams],
      queryFn: () => authFetchOld.get("GetScriptCode", { params: queryParams }),
      ...config,
    });

  const executeScriptQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ExecuteScriptParams
  >({
    mutationKey: ["scripts", "execute"],
    mutationFn: (params) => authFetchOld.get("ExecuteScript", { params }),
  });

  const removeScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptParams
  >({
    mutationKey: ["scripts", "remove"],
    mutationFn: (params) => authFetchOld.get("RemoveScript", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const createScriptQuery = useMutation<
    AxiosResponse<Script>,
    AxiosError<ApiError>,
    CreateScriptParams
  >({
    mutationKey: ["scripts", "create"],
    mutationFn: (params) => authFetchOld.get("CreateScript", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const editScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    EditScriptParams
  >({
    mutationKey: ["scripts", "edit"],
    mutationFn: (params) => authFetchOld.get("EditScript", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const copyScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    CopyScriptParams
  >({
    mutationKey: ["scripts", "copy"],
    mutationFn: (params) => authFetchOld.get("CopyScript", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const removeScriptAttachmentQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptAttachmentParams
  >({
    mutationKey: ["scripts", "removeAttachment"],
    mutationFn: (params) =>
      authFetchOld.get("RemoveScriptAttachment", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const createScriptAttachmentQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    CreateScriptAttachmentParams
  >({
    mutationKey: ["scripts", "createAttachment"],
    mutationFn: (params) =>
      authFetchOld.get("CreateScriptAttachment", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
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
