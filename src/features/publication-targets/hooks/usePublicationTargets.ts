import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/api/QueryFnType.d";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PublicationTarget, S3Target, SwiftTarget } from "../types";
import * from "@canonical/landscape-openapi";

interface GetPublicationTargetsResponse {
  publication_targets: PublicationTarget[];
}

interface GetPublicationTargetsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CreatePublicationTargetParams {
  display_name: string;
  s3?: S3Target;
  swift?: SwiftTarget;
}

interface EditPublicationTargetParams {
  name: string;
  display_name?: string;
  s3?: S3Target;
  swift?: SwiftTarget;
}

interface RemovePublicationTargetParams {
  name: string;
}

export default function usePublicationTargets() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const getPublicationTargetsQuery: QueryFnType<
    AxiosResponse<GetPublicationTargetsResponse>,
    GetPublicationTargetsParams
  > = (queryParams = {}, config = {}) =>
    useQuery<
      AxiosResponse<GetPublicationTargetsResponse>,
      AxiosError<ApiError>
    >({
      queryKey: ["publicationTargets", queryParams],
      queryFn: async () =>
        authFetch.get("publicationTargets", { params: queryParams }),
      ...config,
    });

  const createPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTarget>,
    AxiosError<ApiError>,
    CreatePublicationTargetParams
  >({
    mutationFn: async (params) => authFetch.post("publicationTargets", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publicationTargets"] }),
  });

  const editPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTarget>,
    AxiosError<ApiError>,
    EditPublicationTargetParams
  >({
    mutationFn: async ({ name, ...params }) => authFetch.patch(name, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publicationTargets"] }),
  });

  const removePublicationTargetQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePublicationTargetParams
  >({
    mutationFn: async ({ name }) => authFetch.delete(name),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publicationTargets"] }),
  });

  return {
    getPublicationTargetsQuery,
    createPublicationTargetQuery,
    editPublicationTargetQuery,
    removePublicationTargetQuery,
  };
}
