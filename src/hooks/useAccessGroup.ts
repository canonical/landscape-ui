import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../types/ApiError";
import useFetch from "./useFetch";
import { AccessGroup } from "../types/AccessGroup";
import useDebug from "./useDebug";

interface useAccessGroupResult {
  getAccessGroupQuery: QueryFnType<AxiosResponse<AccessGroup[]>, {}>;
  createAccessGroupQuery: UseMutationResult<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    CreateAccessGroupParams
  >;
  removeAccessGroupQuery: UseMutationResult<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    RemoveAccessGroupParams
  >;
}

interface CreateAccessGroupParams {
  title: string;
  parent: string;
}
interface RemoveAccessGroupParams {
  name: string;
}

export default function useAccessGroup(): useAccessGroupResult {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const debug = useDebug();

  const getAccessGroupQuery: QueryFnType<AxiosResponse<AccessGroup[]>, {}> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<AccessGroup[]>, AxiosError<ApiError>>({
      queryKey: ["accessGroups"],
      queryFn: () => authFetch!.get("GetAccessGroups", { params: queryParams }),
      ...config,
    });

  const createAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    CreateAccessGroupParams
  >({
    mutationKey: ["accessGroups", "new"],
    mutationFn: (params) => authFetch!.get("CreateAccessGroup", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["accessGroups"]).catch(debug);
    },
  });

  const removeAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    RemoveAccessGroupParams
  >({
    mutationKey: ["accessGroups", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveAccessGroup", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["accessGroups"]).catch(debug);
    },
  });

  return {
    getAccessGroupQuery,
    createAccessGroupQuery,
    removeAccessGroupQuery,
  };
}
