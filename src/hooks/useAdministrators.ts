import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/ApiError";
import useFetchOld from "./useFetchOld";
import { Administrator } from "@/types/Administrator";
import { Activity } from "@/features/activities";
import useFetch from "./useFetch";

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
    onSuccess: () => queryClient.invalidateQueries(["administrators"]),
  });

  const disableAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    DisableAdministratorParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("DisableAdministrator", { params }),
    onSuccess: () => queryClient.invalidateQueries(["administrators"]),
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
        queryClient.invalidateQueries(["administrators"]),
        queryClient.invalidateQueries(["roles"]),
      ]),
  });

  return {
    getAdministratorsQuery,
    inviteAdministratorQuery,
    disableAdministratorQuery,
    editAdministratorQuery,
  };
}
