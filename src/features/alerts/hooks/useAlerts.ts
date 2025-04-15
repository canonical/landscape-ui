import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  Alert,
  AssociateAlertParams,
  DisassociateAlertParams,
  SubscriptionParams,
} from "../types";

export default function useAlerts() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const authFetchOld = useFetchOld();

  const getAlertsQuery: QueryFnType<AxiosResponse<Alert[]>, undefined> = () =>
    useQuery<AxiosResponse<Alert[]>, AxiosError<ApiError>>({
      queryKey: ["alert"],
      queryFn: async () => authFetch.get("alerts"),
    });

  const subscribeQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscriptionParams
  >({
    mutationKey: ["alert", "subscribe"],
    mutationFn: async (params) =>
      authFetchOld.get("SubscribeToAlert", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  const unsubscribeQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscriptionParams
  >({
    mutationKey: ["alert", "unsubscribe"],
    mutationFn: async (params) =>
      authFetchOld.get("UnsubscribeFromAlert", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  const associateAlert = useMutation<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    AssociateAlertParams
  >({
    mutationKey: ["alert", "associate"],
    mutationFn: async (params) =>
      authFetchOld.get("AssociateAlert", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  const disassociateAlert = useMutation<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    DisassociateAlertParams
  >({
    mutationKey: ["alert", "disassociate"],
    mutationFn: async (params) =>
      authFetchOld.get("DisassociateAlert", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  return {
    getAlertsQuery,
    subscribeQuery,
    unsubscribeQuery,
    associateAlert,
    disassociateAlert,
  };
}
