import useAuthAccounts from "@/hooks/useAuthAccounts";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RegenerateSelfHostedLicenseResponse {
  license_url: string;
}

export const useRegenerateSelfHostedLicense = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const { currentAccount } = useAuthAccounts();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<RegenerateSelfHostedLicenseResponse>,
    AxiosError<ApiError>
  >({
    mutationKey: ["selfHostedLicense", "regenerate", currentAccount.name],
    mutationFn: async () =>
      authFetch.post("self-hosted/license-url:regenerate", {}),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["selfHostedLicense", currentAccount.name],
        response,
      );
    },
  });

  return {
    regenerateSelfHostedLicense: mutateAsync,
    isRegeneratingSelfHostedLicense: isPending,
  };
};

export default useRegenerateSelfHostedLicense;
