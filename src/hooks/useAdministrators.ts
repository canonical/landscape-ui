import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/ApiError";
import useFetchOld from "./useFetchOld";
import { Administrator } from "@/types/Administrator";
import { Activity } from "@/features/activities";
import useFetch from "./useFetch";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Invitation } from "@/types/Invitation";

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
      queryFn: () => authFetchOld!.get("GetAdministrators"),
      ...config,
    });

  const inviteAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InviteAdministratorParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("InviteAdministrator", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invitations"] }),
  });

  const disableAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    DisableAdministratorParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("DisableAdministrator", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["administrators"] }),
  });

  const editAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    EditAdministratorParams
  >({
    mutationFn: ({ id, ...params }) =>
      authFetch!.put(`administrators/${id}`, params),
    onSuccess: () =>
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
      queryFn: () => authFetch!.get("/invitations", { params: queryParams }),
      ...config,
    });

  const revokeInvitationQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InvitationActionParams
  >({
    mutationFn: (params) => authFetch!.delete(`/invitations/${params.id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invitations"] }),
  });

  const resendInvitationQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InvitationActionParams
  >({
    mutationFn: (params) => authFetch!.post(`/invitations/${params.id}`),
    onSuccess: () =>
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
