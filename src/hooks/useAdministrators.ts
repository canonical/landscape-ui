import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../types/ApiError";
import useFetchOld from "./useFetchOld";
import { Administrator } from "../types/Administrator";
import { Activity } from "../types/Activity";

interface InviteAdministratorParams {
  email: string;
  name: string;
  roles?: string[];
}

interface DisableAdministratorParams {
  email: string;
}

export default function useAdministrators() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const getAdministratorsQuery: QueryFnType<
    AxiosResponse<Administrator[]>,
    undefined
  > = (_, config = {}) =>
    useQuery<AxiosResponse<Administrator[]>, AxiosError<ApiError>>({
      queryKey: ["administrators"],
      queryFn: () => authFetch!.get("GetAdministrators"),
      ...config,
    });

  const inviteAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InviteAdministratorParams
  >({
    mutationFn: (params) => authFetch!.get("InviteAdministrator", { params }),
    onSuccess: () => queryClient.invalidateQueries(["administrators"]),
  });

  const disableAdministratorQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    DisableAdministratorParams
  >({
    mutationFn: (params) => authFetch!.get("DisableAdministrator", { params }),
    onSuccess: () => queryClient.invalidateQueries(["administrators"]),
  });

  return {
    getAdministratorsQuery,
    inviteAdministratorQuery,
    disableAdministratorQuery,
  };
}
