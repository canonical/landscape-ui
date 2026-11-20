import useAuthAccounts from "@/hooks/useAuthAccounts";
import useFetch from "@/hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { LEGACY_LICENSE_ENTITLEMENT_WAIT_MS } from "./constants";

interface SelfHostedEnabledResponse {
  enabled: boolean;
}

export const useGetSelfHostedEnabled = (enabled: boolean) => {
  const authFetch = useFetch();
  const { currentAccount } = useAuthAccounts();

  const {
    data: response,
    error,
    isFetching,
  } = useQuery<AxiosResponse<SelfHostedEnabledResponse>, Error>({
    queryKey: ["selfHostedEnabled", currentAccount.name],
    queryFn: async () => {
      try {
        return await authFetch.get<SelfHostedEnabledResponse>(
          "self-hosted/status",
        );
      } catch (cause) {
        throw new Error("Could not check legacy license entitlement.", {
          cause,
        });
      }
    },
    enabled,
  });

  const isWaiting = enabled && isFetching;
  // Give each account and fetch cycle its own UI deadline without changing the query.
  const wait = useMemo(
    () => (isWaiting ? { accountName: currentAccount.name } : null),
    [currentAccount.name, isWaiting],
  );
  const [expiredWait, setExpiredWait] = useState<typeof wait>(null);

  useEffect(() => {
    if (!wait) {
      return;
    }

    const timer = window.setTimeout(() => {
      console.warn(
        "Legacy license entitlement check is still pending; continuing in the background.",
        { waitMs: LEGACY_LICENSE_ENTITLEMENT_WAIT_MS },
      );
      setExpiredWait(wait);
    }, LEGACY_LICENSE_ENTITLEMENT_WAIT_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [wait]);

  return {
    isGettingSelfHostedEnabled: wait !== null && wait !== expiredWait,
    isSelfHostedEnabled: !error && response?.data?.enabled === true,
    selfHostedEnabledError: error,
  };
};
