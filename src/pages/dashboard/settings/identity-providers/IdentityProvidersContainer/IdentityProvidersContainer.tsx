import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  ProviderList,
  ProvidersEmptyState,
  useGetLoginMethods,
} from "@/features/auth";

const IdentityProvidersContainer: FC = () => {
  const { loginMethods, loginMethodsLoading } = useGetLoginMethods();

  if (loginMethodsLoading) {
    return <LoadingState />;
  }

  if (!loginMethods) {
    return <ProvidersEmptyState />;
  }

  const { ubuntu_one, oidc } = loginMethods;

  const isUbuntuOneAvailable = ubuntu_one?.available;
  const isOidcAvailable = oidc?.available && oidc?.configurations?.length > 0;

  if (!isUbuntuOneAvailable && !isOidcAvailable) {
    return <ProvidersEmptyState />;
  }

  return (
    <ProviderList
      oidcAvailable={!!oidc?.available}
      oidcProviders={oidc?.configurations ?? []}
      ubuntuOneAvailable={!!ubuntu_one?.available}
      ubuntuOneEnabled={!!ubuntu_one?.enabled}
    />
  );
};

export default IdentityProvidersContainer;
