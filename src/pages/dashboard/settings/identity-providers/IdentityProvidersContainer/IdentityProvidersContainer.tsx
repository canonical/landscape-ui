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
      {!isLoading && !getAuthMethodsQueryResult && <ProvidersEmptyState />}
      {!isLoading && getAuthMethodsQueryResult && (
        <ProviderList
          oidcProviders={getAuthMethodsQueryResult.data.oidc}
          ubuntuOneEnabled={
            getAuthMethodsQueryResult.data["ubuntu-one"].enabled
          }
        />
      )}
    </>
  );
};

export default IdentityProvidersContainer;
