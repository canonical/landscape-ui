import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RemovalProfile } from "../types";
import useFetchOld from "@/hooks/useFetchOld";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";

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
    mutationFn: (params) =>
      authFetchOld!.get("CreateRemovalProfile", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["removalProfiles"] }),
  });

  const editRemovalProfileQuery = useMutation<
    AxiosResponse<RemovalProfile[]>,
    AxiosError<ApiError>,
    EditRemovalProfileParams
  >({
    mutationFn: (params) => authFetchOld!.get(`EditRemovalProfile`, { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["removalProfiles"] }),
  });

  const removeRemovalProfileQuery = useMutation<
    AxiosResponse<RemovalProfile[]>,
    AxiosError<ApiError>,
    RemoveRemovalProfileParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get(`RemoveRemovalProfile`, { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["removalProfiles"] }),
  });

  const getRemovalProfilesQuery: QueryFnType<
    AxiosResponse<RemovalProfile[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<RemovalProfile[]>, AxiosError<ApiError>>({
      queryKey: ["removalProfiles"],
      queryFn: () =>
        authFetchOld!.get("GetRemovalProfiles", { params: queryParams }),
      ...config,
    });

  return {
    createRemovalProfileQuery,
    editRemovalProfileQuery,
    removeRemovalProfileQuery,
    getRemovalProfilesQuery,
  };
}
