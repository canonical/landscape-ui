import { Alert, AlertSummaryResponse } from "@/types/Alert";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import useFetch from "./useFetch";
import useFetchOld from "./useFetchOld";

export interface SubscriptionParams {
  alert_type: string;
}

interface AssociateAlertParams {
  name: string;
  all_computers?: boolean;
  tags?: string[];
}

interface DisassociateAlertParams {
  name: string;
  all_computers?: boolean;
  tags?: string[];
}

interface UseAlertsResult {
  getAlertsQuery: QueryFnType<AxiosResponse<Alert[]>, undefined>;
  getAlertsSummaryQuery: QueryFnType<
    AxiosResponse<AlertSummaryResponse>,
    undefined
  >;
  subscribeQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscriptionParams
  >;
  unsubscribeQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscriptionParams
  >;
  associateAlert: UseMutationResult<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    AssociateAlertParams
  >;
  disassociateAlert: UseMutationResult<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    DisassociateAlertParams
  >;
}

export default function useAlerts(): UseAlertsResult {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const authFetchOld = useFetchOld();

  const getAlertsQuery: QueryFnType<AxiosResponse<Alert[]>, undefined> = () =>
    useQuery<AxiosResponse<Alert[]>, AxiosError<ApiError>>({
      queryKey: ["alert"],
      queryFn: () => authFetch.get("alerts"),
    });

  const getAlertsSummaryQuery: QueryFnType<
    AxiosResponse<AlertSummaryResponse>,
    undefined
  > = () =>
    useQuery<AxiosResponse<AlertSummaryResponse>, AxiosError<ApiError>>({
      queryKey: ["alert", "summary"],
      queryFn: () => authFetch.get("alerts/summary"),
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
    getAlertsSummaryQuery,
    subscribeQuery,
    unsubscribeQuery,
    associateAlert,
    disassociateAlert,
  };
}
