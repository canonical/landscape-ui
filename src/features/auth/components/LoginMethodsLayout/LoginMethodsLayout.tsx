import type { FC } from "react";
import type { LoginMethods } from "@/features/auth";
import { AvailableProviderList, LoginForm } from "@/features/auth";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import { Link } from "react-router";

interface LoginMethodsProps {
  readonly methods: LoginMethods | null;
}

const LoginMethodsLayout: FC<LoginMethodsProps> = ({ methods }) => {
  const { isSelfHosted } = useEnv();

  if (!methods) {
    return null;
  }

  const isStandaloneOidcEnabled = Boolean(
    methods.standalone_oidc.available && methods.standalone_oidc.enabled,
  );

  const isUbuntuOneEnabled = Boolean(
    methods.ubuntu_one.available && methods.ubuntu_one.enabled,
  );

  const isPasswordEnabled = Boolean(
    methods.password.available && methods.password.enabled,
  );

  const isIdentityAvailable = Boolean(
    methods.pam.available && methods.pam.enabled,
  );

  const availableOidcProviders = methods.oidc.available
    ? methods.oidc.configurations.filter(({ enabled }) => enabled)
    : [];

  const loginFormAvailable = isPasswordEnabled || isIdentityAvailable;

  const providersAvailable =
    isUbuntuOneEnabled ||
    isStandaloneOidcEnabled ||
    methods.oidc.configurations.length > 0;

  return (
    <>
      {loginFormAvailable && (
        <LoginForm isIdentityAvailable={isIdentityAvailable} />
      )}
      {isSelfHosted && isPasswordEnabled && (
        <p>
          <Link to={ROUTES.auth.forgotPassword()}>Forgot password?</Link>
        </p>
      )}
      {providersAvailable && (
        <AvailableProviderList
          isStandaloneOidcEnabled={isStandaloneOidcEnabled}
          isUbuntuOneEnabled={isUbuntuOneEnabled}
          oidcProviders={availableOidcProviders}
        />
      )}
      {!loginFormAvailable && !providersAvailable && (
        <span>
          It seems like you have no way to get in. Please contact our support
          team.
        </span>
      )}
    </>
  );
};

export default LoginMethodsLayout;
