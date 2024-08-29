import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  ProviderList,
  ProvidersEmptyState,
  useIdentityProviders,
} from "@/features/identity-providers";

const IdentityProvidersContainer: FC = () => {
  const { getAuthMethodsQuery } = useIdentityProviders();

  const { data: getAuthMethodsQueryResult, isLoading } = getAuthMethodsQuery();

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading &&
        (!getAuthMethodsQueryResult ||
          (!getAuthMethodsQueryResult.data.oidc.length &&
            !getAuthMethodsQueryResult.data["ubuntu-one"].enabled)) && (
          <ProvidersEmptyState />
        )}
      {!isLoading &&
        getAuthMethodsQueryResult &&
        getAuthMethodsQueryResult.data.oidc.length > 0 && (
          <ProviderList providers={getAuthMethodsQueryResult.data.oidc} />
        )}
    </>
  );
};

export default IdentityProvidersContainer;
