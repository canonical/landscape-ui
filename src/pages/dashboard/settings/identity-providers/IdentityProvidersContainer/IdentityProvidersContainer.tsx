import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  ProviderList,
  ProvidersEmptyState,
  useUnsigned,
} from "@/features/auth";

const IdentityProvidersContainer: FC = () => {
  const { getLoginMethodsQuery } = useUnsigned();

  const { data: getLoginMethodsQueryResult, isLoading } =
    getLoginMethodsQuery();

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading &&
        (!getLoginMethodsQueryResult ||
          (!getLoginMethodsQueryResult.data.ubuntu_one.available &&
            getLoginMethodsQueryResult.data.oidc.configurations.length ===
              0)) && <ProvidersEmptyState />}
      {!isLoading &&
        getLoginMethodsQueryResult &&
        (getLoginMethodsQueryResult.data.ubuntu_one.available ||
          (getLoginMethodsQueryResult.data.oidc.available &&
            getLoginMethodsQueryResult.data.oidc.configurations.length >
              0)) && (
          <ProviderList
            oidcAvailable={getLoginMethodsQueryResult.data.oidc.available}
            oidcProviders={getLoginMethodsQueryResult.data.oidc.configurations}
            ubuntuOneAvailable={
              getLoginMethodsQueryResult.data.ubuntu_one.available
            }
            ubuntuOneEnabled={
              getLoginMethodsQueryResult.data.ubuntu_one.enabled
            }
          />
        )}
    </>
  );
};

export default IdentityProvidersContainer;
