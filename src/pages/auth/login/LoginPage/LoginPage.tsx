import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  AvailableProviderList,
  useIdentityProviders,
} from "@/features/identity-providers";
import useEnv from "@/hooks/useEnv";
import AuthTemplate from "@/templates/auth";
import LoginForm from "../LoginForm";
import classes from "./LoginPage.module.scss";

const LoginPage: FC = () => {
  const { getAuthMethodsQuery } = useIdentityProviders();
  const { isSaas } = useEnv();

  const { data: getAuthMethodsQueryResult, isLoading } = getAuthMethodsQuery(
    {},
    { enabled: isSaas },
  );

  const availableOidcProviders =
    getAuthMethodsQueryResult?.data.oidc.filter(({ enabled }) => enabled) ?? [];

  const isUbuntuOneEnabled =
    !!getAuthMethodsQueryResult?.data["ubuntu-one"].enabled;

  return (
    <AuthTemplate title="Login">
      {isLoading && <LoadingState />}
      {(!isSaas ||
        (!isLoading && getAuthMethodsQueryResult?.data.password)) && (
        <LoginForm />
      )}
      {isSaas &&
        !isLoading &&
        getAuthMethodsQueryResult?.data.password &&
        (availableOidcProviders.length > 0 || isUbuntuOneEnabled) && (
          <p className={classes.divider}>OR</p>
        )}
      {isSaas &&
        !isLoading &&
        (availableOidcProviders.length > 0 || isUbuntuOneEnabled) && (
          <AvailableProviderList
            isUbuntuOneEnabled={isUbuntuOneEnabled}
            oidcProviders={availableOidcProviders}
          />
        )}
    </AuthTemplate>
  );
};

export default LoginPage;
