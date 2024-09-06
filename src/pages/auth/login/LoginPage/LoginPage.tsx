import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  AvailableProviderList,
  useIdentityProviders,
} from "@/features/identity-providers";
import AuthTemplate from "@/templates/auth";
import LoginForm from "../LoginForm";
import classes from "./LoginPage.module.scss";

const LoginPage: FC = () => {
  const { getLoginMethodsQuery } = useIdentityProviders();

  const { data: getLoginMethodsQueryResult, isLoading } =
    getLoginMethodsQuery();

  const availableOidcProviders = getLoginMethodsQueryResult?.data.oidc.available
    ? getLoginMethodsQueryResult?.data.oidc.configurations.filter(
        ({ enabled }) => enabled,
      )
    : [];

  const isUbuntuOneEnabled = !!(
    getLoginMethodsQueryResult?.data.ubuntu_one.available &&
    getLoginMethodsQueryResult.data.ubuntu_one.enabled
  );

  const isPasswordEnabled = !!(
    getLoginMethodsQueryResult?.data.password.available &&
    getLoginMethodsQueryResult.data.password.enabled
  );

  return (
    <AuthTemplate title="Login">
      {isLoading && <LoadingState />}
      {!isLoading && isPasswordEnabled && <LoginForm />}
      {!isLoading &&
        isPasswordEnabled &&
        (isUbuntuOneEnabled || availableOidcProviders.length > 0) && (
          <p className={classes.divider}>OR</p>
        )}
      {!isLoading &&
        (isUbuntuOneEnabled || availableOidcProviders.length > 0) && (
          <AvailableProviderList
            isUbuntuOneEnabled={isUbuntuOneEnabled}
            oidcProviders={availableOidcProviders}
          />
        )}
      {!isLoading &&
        !isPasswordEnabled &&
        !isUbuntuOneEnabled &&
        !availableOidcProviders.length && (
          <span>
            It seems like you have no way to get in. Please contact our support
            team.
          </span>
        )}
    </AuthTemplate>
  );
};

export default LoginPage;
