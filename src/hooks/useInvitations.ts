import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "./useFetch";
import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { Activity } from "@/features/activities";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Invitation } from "@/types/Invitation";

interface GetInvitationsParams {
  id: number;
}

interface InvitationActionParams {
  id: number;
}

export default function useInvitations() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

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
    onSuccess: () => queryClient.invalidateQueries(["invitations"]),
  });

  const resendInvitationQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InvitationActionParams
  >({
    mutationFn: (params) => authFetch!.post(`/invitations/${params.id}`),
    onSuccess: () => queryClient.invalidateQueries(["invitations"]),
  });

  return {
    getInvitationsQuery,
    revokeInvitationQuery,
    resendInvitationQuery,
  };
}
