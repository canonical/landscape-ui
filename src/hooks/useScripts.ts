import { QueryFnType } from "../types/QueryFnType";
import { Script } from "../types/Script";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useScripts = () => {
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

  return { getScriptsQuery, getScriptCodeQuery, executeScriptQuery };
};
