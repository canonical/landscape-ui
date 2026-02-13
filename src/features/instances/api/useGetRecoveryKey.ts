import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RecoveryKey } from "../types";

export const useGetRecoveryKey = (computerId: number) => {
  const authFetch = useFetch();

  const {
    data: response,
    isFetching,
    isPending,
    isFetched,
  } = useQuery<AxiosResponse<RecoveryKey | null>, AxiosError<ApiError>>({
    queryKey: ["instance", "recovery-key", computerId],
    queryFn: async () => authFetch.get(`computers/${computerId}/recovery-key`),
  });

  const recoveryKey = response?.data?.fde_recovery_key ?? null;
  const recoveryKeyActivity = response?.data?.activity ?? null;

  const isRecoveryKeyActivityInProgress = Boolean(
    recoveryKeyActivity &&
    !["succeeded", "failed", "canceled"].includes(
      recoveryKeyActivity.activity_status,
    ),
  );

  return {
    recoveryKey,
    recoveryKeyActivity,
    isGettingRecoveryKey: isFetching || isPending,
    isRecoveryKeyFetched: isFetched,
    isRecoveryKeyActivityInProgress,
  };
};

export default useGetRecoveryKey;
