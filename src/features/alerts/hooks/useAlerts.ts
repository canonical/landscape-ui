import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
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
      queryFn: () => authFetch.get("alerts"),
    });

  const subscribeQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscriptionParams
  >({
    mutationKey: ["alert", "subscribe"],
    mutationFn: (params) => authFetchOld.get("SubscribeToAlert", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  const unsubscribeQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscriptionParams
  >({
    mutationKey: ["alert", "unsubscribe"],
    mutationFn: (params) =>
      authFetchOld.get("UnsubscribeFromAlert", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  const associateAlert = useMutation<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    AssociateAlertParams
  >({
    mutationKey: ["alert", "associate"],
    mutationFn: (params) => authFetchOld.get("AssociateAlert", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  const disassociateAlert = useMutation<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    DisassociateAlertParams
  >({
    mutationKey: ["alert", "disassociate"],
    mutationFn: (params) => authFetchOld.get("DisassociateAlert", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alert"] }),
  });

  return {
    getAlertsQuery,
    subscribeQuery,
    unsubscribeQuery,
    associateAlert,
    disassociateAlert,
  };
}
