import type { QueryFnType } from "@/types/QueryFnType";
import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/api/ApiError";
import useFetchOld from "./useFetchOld";
import type { Administrator } from "@/types/Administrator";
import type { Activity } from "@/features/activities";
import useFetch from "./useFetch";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Invitation } from "@/types/Invitation";

interface InviteAdministratorParams {
  email: string;
  name: string;
  roles?: string[];
}

interface DisableAdministratorParams {
  email: string;
}

interface EditAdministratorParams {
  id: number;
  roles: string[];
}

interface GetInvitationsParams {
  id?: number;
}

interface InvitationActionParams {
  id: number;
}

export default function useAdministrators() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getAdministratorsQuery: QueryFnType<
    AxiosResponse<Administrator[]>,
    undefined
  > = (_, config = {}) =>
    useQuery<AxiosResponse<Administrator[]>, AxiosError<ApiError>>({
      queryKey: ["administrators"],
      queryFn: async () => authFetchOld.get("GetAdministrators"),
      ...config,
    });

  const inviteAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InviteAdministratorParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("InviteAdministrator", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["invitations"] }),
  });

  const disableAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    DisableAdministratorParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("DisableAdministrator", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["administrators"] }),
  });

  const editAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    EditAdministratorParams
  >({
    mutationFn: async ({ id, ...params }) =>
      authFetch.put(`administrators/${id}`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["administrators"] }),
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
      ]),
  });

  const getInvitationsQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Invitation>>,
    GetInvitationsParams
  > = (queryParams, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<Invitation>>,
      AxiosError<ApiError>
    >({
      queryKey: ["invitations", queryParams],
      queryFn: async () =>
        authFetch.get("/invitations", { params: queryParams }),
      ...config,
    });

  const revokeInvitationQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InvitationActionParams
  >({
    mutationFn: async (params) => authFetch.delete(`/invitations/${params.id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["invitations"] }),
  });

  const resendInvitationQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InvitationActionParams
  >({
    mutationFn: async (params) => authFetch.post(`/invitations/${params.id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["invitations"] }),
  });

  return {
    getAdministratorsQuery,
    inviteAdministratorQuery,
    disableAdministratorQuery,
    editAdministratorQuery,
    getInvitationsQuery,
    revokeInvitationQuery,
    resendInvitationQuery,
  };
}
