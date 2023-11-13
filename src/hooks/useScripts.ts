import { QueryFnType } from "../types/QueryFnType";
import { Script } from "../types/Script";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "./useFetch";
import { ApiError } from "../types/ApiError";
import { Activity } from "../types/Activity";

interface GetScriptsParams {
  limit?: number;
  offset?: number;
}

interface GetScriptCodeParams {
  script_id: number;
}

interface ExecuteScriptParams {
  query: string;
  script_id: number;
  username: string;
  deliver_after?: string; // YYYY-MM-DDTHH:MM:SSZ
}

interface RemoveScriptParams {
  script_id: number;
}

interface CreateScriptParams {
  title: string;
  time_limit: number;
  code: string;
  username: string;
  access_group: string;
}

interface EditScriptParams {
  script_id: number;
  title: string;
  time_limit: number;
  code: string;
  username: string;
}

interface CopyScriptParams {
  script_id: number;
  destination_title: string;
  access_group: string;
}

interface RemoveScriptAttachmentParams {
  script_id: number;
  filename: string;
}

interface CreateScriptAttachmentParams {
  script_id: number;
  file: string; // <filename>$$<base64 encoded file contents>
}

export default function useScripts() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const getScriptsQuery: QueryFnType<
    AxiosResponse<Script[]>,
    GetScriptsParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<Script[]>, AxiosError<ApiError>>({
      queryKey: ["scripts", { ...queryParams }],
      queryFn: () => authFetch!.get("GetScripts", { params: queryParams }),
      ...config,
    });

  const getScriptCodeQuery: QueryFnType<
    AxiosResponse<string>,
    GetScriptCodeParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<string>, AxiosError<ApiError>>({
      queryKey: ["scriptCode", { ...queryParams }],
      queryFn: () => authFetch!.get("GetScriptCode", { params: queryParams }),
      ...config,
    });

  const executeScriptQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ExecuteScriptParams
  >({
    mutationKey: ["scripts", "execute"],
    mutationFn: (params) => authFetch!.get("ExecuteScript", { params }),
  });

  const removeScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptParams
  >({
    mutationKey: ["scripts", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveScript", { params }),
    onSuccess: () => queryClient.invalidateQueries(["scripts"]),
  });

  const createScriptQuery = useMutation<
    AxiosResponse<Script>,
    AxiosError<ApiError>,
    CreateScriptParams
  >({
    mutationKey: ["scripts", "create"],
    mutationFn: (params) => authFetch!.get("CreateScript", { params }),
    onSuccess: () => queryClient.invalidateQueries(["scripts"]),
  });

  const editScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    EditScriptParams
  >({
    mutationKey: ["scripts", "edit"],
    mutationFn: (params) => authFetch!.get("EditScript", { params }),
    onSuccess: () => queryClient.invalidateQueries(["scripts"]),
  });

  const copyScriptQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    CopyScriptParams
  >({
    mutationKey: ["scripts", "copy"],
    mutationFn: (params) => authFetch!.get("CopyScript", { params }),
    onSuccess: () => queryClient.invalidateQueries(["scripts"]),
  });

  const removeScriptAttachmentQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptAttachmentParams
  >({
    mutationKey: ["scripts", "removeAttachment"],
    mutationFn: (params) =>
      authFetch!.get("RemoveScriptAttachment", { params }),
    onSuccess: () => queryClient.invalidateQueries(["scripts"]),
  });

  const createScriptAttachmentQuery = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    CreateScriptAttachmentParams
  >({
    mutationKey: ["scripts", "createAttachment"],
    mutationFn: (params) =>
      authFetch!.get("CreateScriptAttachment", { params }),
    onSuccess: () => queryClient.invalidateQueries(["scripts"]),
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
