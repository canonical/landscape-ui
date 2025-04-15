import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RemovalProfile } from "../types";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";

export interface CreateRemovalProfileParams {
  all_computers: boolean;
  days_without_exchange: number;
  title: string;
  access_group?: string;
  tags?: string[];
}

interface EditRemovalProfileParams extends Partial<CreateRemovalProfileParams> {
  name: string;
}

interface RemoveRemovalProfileParams {
  name: string;
}

export default function useRemovalProfiles() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();

  const createRemovalProfileQuery = useMutation<
    AxiosResponse<RemovalProfile[]>,
    AxiosError<ApiError>,
    CreateRemovalProfileParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("CreateRemovalProfile", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["removalProfiles"] }),
  });

  const editRemovalProfileQuery = useMutation<
    AxiosResponse<RemovalProfile[]>,
    AxiosError<ApiError>,
    EditRemovalProfileParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get(`EditRemovalProfile`, { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["removalProfiles"] }),
  });

  const removeRemovalProfileQuery = useMutation<
    AxiosResponse<RemovalProfile[]>,
    AxiosError<ApiError>,
    RemoveRemovalProfileParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get(`RemoveRemovalProfile`, { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["removalProfiles"] }),
  });

  const getRemovalProfilesQuery: QueryFnType<
    AxiosResponse<RemovalProfile[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<RemovalProfile[]>, AxiosError<ApiError>>({
      queryKey: ["removalProfiles"],
      queryFn: async () =>
        authFetchOld.get("GetRemovalProfiles", { params: queryParams }),
      ...config,
    });

  return {
    createRemovalProfileQuery,
    editRemovalProfileQuery,
    removeRemovalProfileQuery,
    getRemovalProfilesQuery,
  };
}
