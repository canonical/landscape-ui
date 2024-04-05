import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Alert, AlertSummaryResponse, Subscriber } from "../types/Alert";
import { ApiError } from "../types/ApiError";
import { QueryFnType } from "../types/QueryFnType";
import useDebug from "./useDebug";
import useFetch from "./useFetch";
import useFetchOld from "./useFetchOld";

interface SubscribeParams {
  alert_type: string;
}

interface UnsubscribeParams {
  alert_type: string;
}

interface GetAlertSubscribersParams {
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
  getAlertSubscribersQuery: QueryFnType<
    AxiosResponse<Subscriber[]>,
    GetAlertSubscribersParams
  >;
  subscribeQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscribeParams
  >;
  unsubscribeQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    UnsubscribeParams
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
  const debug = useDebug();

  const getAlertsQuery: QueryFnType<AxiosResponse<Alert[]>, undefined> = () =>
    useQuery<AxiosResponse<Alert[]>, AxiosError<ApiError>>({
      queryKey: ["alert"],
      queryFn: () => authFetch!.get("alerts"),
    });

  const getAlertsSummaryQuery: QueryFnType<
    AxiosResponse<AlertSummaryResponse>,
    undefined
  > = () =>
    useQuery<AxiosResponse<AlertSummaryResponse>, AxiosError<ApiError>>({
      queryKey: ["alert", "summary"],
      queryFn: () => authFetch!.get("alerts/summary"),
    });

  const getAlertSubscribersQuery: QueryFnType<
    AxiosResponse<Subscriber[]>,
    GetAlertSubscribersParams
  > = (queryParams, config = {}) => {
    return useQuery<AxiosResponse<Subscriber[]>, AxiosError<ApiError>>({
      queryKey: ["alert", "subscribers"],
      queryFn: () =>
        authFetchOld!.get("GetAlertSubscribers", { params: queryParams }),
      ...config,
    });
  };

  const subscribeQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SubscribeParams
  >({
    mutationKey: ["alert", "subscribe"],
    mutationFn: (params) => authFetchOld!.get("SubscribeToAlert", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["alert"]).catch(debug);
    },
  });

  const unsubscribeQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    UnsubscribeParams
  >({
    mutationKey: ["alert", "unsubscribe"],
    mutationFn: (params) =>
      authFetchOld!.get("UnsubscribeFromAlert", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["alert"]).catch(debug);
    },
  });

  const associateAlert = useMutation<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    AssociateAlertParams
  >({
    mutationKey: ["alert", "associate"],
    mutationFn: (params) => authFetchOld!.get("AssociateAlert", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["alert"]).catch(debug);
    },
  });

  const disassociateAlert = useMutation<
    AxiosResponse<Alert>,
    AxiosError<ApiError>,
    DisassociateAlertParams
  >({
    mutationKey: ["alert", "disassociate"],
    mutationFn: (params) => authFetchOld!.get("DisassociateAlert", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["alert"]).catch(debug);
    },
  });

  return {
    getAlertsQuery,
    getAlertsSummaryQuery,
    getAlertSubscribersQuery,
    subscribeQuery,
    unsubscribeQuery,
    associateAlert,
    disassociateAlert,
  };
}
