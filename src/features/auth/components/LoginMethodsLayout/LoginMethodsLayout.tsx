import { FC } from "react";
import {
  AvailableProviderList,
  LoginForm,
  LoginMethods,
} from "@/features/auth";

interface LoginMethodsProps {
  methods: LoginMethods | null;
}

const LoginMethodsLayout: FC<LoginMethodsProps> = ({ methods }) => {
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

  const noMethodsAvailable =
    !loginFormAvailable &&
    !isUbuntuOneEnabled &&
    !isStandaloneOidcEnabled &&
    !availableOidcProviders.length;

  return (
    <>
      {loginFormAvailable && (
        <LoginForm isIdentityAvailable={isIdentityAvailable} />
      )}
      {providersAvailable && (
        <AvailableProviderList
          isStandaloneOidcEnabled={isStandaloneOidcEnabled}
          isUbuntuOneEnabled={isUbuntuOneEnabled}
          oidcProviders={availableOidcProviders}
        />
      )}
      {noMethodsAvailable && (
        <span>
          It seems like you have no way to get in. Please contact our support
          team.
        </span>
      )}
    </>
  );
};

export default LoginMethodsLayout;
