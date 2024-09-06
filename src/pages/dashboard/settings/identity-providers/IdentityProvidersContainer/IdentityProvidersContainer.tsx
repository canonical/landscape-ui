import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  ProviderList,
  ProvidersEmptyState,
  useIdentityProviders,
} from "@/features/identity-providers";

const IdentityProvidersContainer: FC = () => {
  const { getLoginMethodsQuery } = useIdentityProviders();

  const { data: getLoginMethodsQueryResult, isLoading } =
    getLoginMethodsQuery();

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading && !getLoginMethodsQueryResult && <ProvidersEmptyState />}
      {!isLoading && getLoginMethodsQueryResult && (
        <ProviderList
          oidcAvailable={getLoginMethodsQueryResult.data.oidc.available}
          oidcProviders={getLoginMethodsQueryResult.data.oidc.configurations}
          ubuntuOneAvailable={
            getLoginMethodsQueryResult.data.ubuntu_one.available
          }
          ubuntuOneEnabled={getLoginMethodsQueryResult.data.ubuntu_one.enabled}
        />
      )}
    </>
  );
};

export default IdentityProvidersContainer;
