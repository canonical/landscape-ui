import useAuthAccounts from "@/hooks/useAuthAccounts";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getSelfHostedLicenseQueryKey } from "./useGetSelfHostedLicense";

interface RegenerateSelfHostedLicenseResponse {
  license_url: string;
}

export const useRegenerateSelfHostedLicense = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const { currentAccount } = useAuthAccounts();
  const queryKey = getSelfHostedLicenseQueryKey(currentAccount.name);

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<RegenerateSelfHostedLicenseResponse>,
    AxiosError<ApiError>,
    ReturnType<typeof getSelfHostedLicenseQueryKey>
  >({
    mutationKey: ["selfHostedLicense", "regenerate", currentAccount.name],
    onMutate: async (queryKeyAtMutationStart) => {
      await queryClient.cancelQueries({ queryKey: queryKeyAtMutationStart });
    },
    mutationFn: async () =>
      authFetch.post("self-hosted/license-url:regenerate", {}),
    onSuccess: (response, queryKeyAtMutationStart) => {
      queryClient.setQueryData(queryKeyAtMutationStart, response);
    },
  });

  return {
    regenerateSelfHostedLicense: () => mutateAsync(queryKey),
    isRegeneratingSelfHostedLicense: isPending,
  };
};

export default useRegenerateSelfHostedLicense;
