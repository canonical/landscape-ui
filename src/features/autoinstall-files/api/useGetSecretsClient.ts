import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SecretsClient {
  is_encrypted: boolean;
  max_versions: number;
}

export const useGetSecretsClient = (): {
  secretsClient: SecretsClient | undefined;
  isSecretsClientLoading: boolean;
} => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<SecretsClient>,
    AxiosError<ApiError>
  >({
    queryKey: ["secretsClient"],
    queryFn: async () => authFetch.get(`secrets-client`),
  });

  return {
    secretsClient: response?.data,
    isSecretsClientLoading: isLoading,
  };
};
