import useFetch from "@/hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import type { OidcIssuer } from "@/features/oidc";
import type { ApiListResponse } from "@/types/ApiListResponse";

interface UseOidcProvidersResponse {
  oidcIssuers: OidcIssuer[];
  oidcDirectoryIssuers: OidcIssuer[];
  isOidcIssuersLoading: boolean;
}

export const useOidcIssuers = (): UseOidcProvidersResponse => {
  const authFetch = useFetch();

  const { data, isLoading } = useQuery({
    queryKey: ["oidcIssuers"],
    queryFn: () =>
      authFetch.get<ApiListResponse<OidcIssuer>>("/auth/oidc-issuers"),
  });

  const oidcIssuers = data?.data.results ?? [];

  return {
    oidcIssuers,
    oidcDirectoryIssuers: oidcIssuers.filter((issuer) =>
      issuer.available_features.includes("directory-import"),
    ),
    isOidcIssuersLoading: isLoading,
  };
};
