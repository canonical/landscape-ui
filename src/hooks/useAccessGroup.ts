import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../types/ApiError";
import useFetch from "./useFetch";
import { AccessGroup } from "../types/AccessGroup";

interface useAccessGroupResult {
  getAccessGroupQuery: QueryFnType<AxiosResponse<AccessGroup[]>, {}>;
}

export default function useAccessGroup(): useAccessGroupResult {
  const authFetch = useFetch();

  const getAccessGroupQuery: QueryFnType<AxiosResponse<AccessGroup[]>, {}> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<AccessGroup[]>, AxiosError<ApiError>>({
      queryKey: ["accessGroups"],
      queryFn: () => authFetch!.get("GetAccessGroups", { params: queryParams }),
      ...config,
    });

  return { getAccessGroupQuery };
}
