import { useState, type FC } from "react";
import { Button } from "@canonical/react-components";
import type { LoginMethods } from "@/features/auth";
import { AvailableProviderList, LoginForm } from "@/features/auth";
import classes from "./LoginMethodsLayout.module.scss";

interface LoginMethodsProps {
  readonly methods: LoginMethods | null;
}

const LoginMethodsLayout: FC<LoginMethodsProps> = ({ methods }) => {
  const [usePasswordLogin, setUsePasswordLogin] = useState(false);
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
  const showPamLogin =
    isIdentityAvailable && (!isPasswordEnabled || !usePasswordLogin);

  const providersAvailable =
    isUbuntuOneEnabled ||
    isStandaloneOidcEnabled ||
    availableOidcProviders.length > 0;

  return (
    <>
      {loginFormAvailable && (
        <LoginForm
          key={showPamLogin ? "pam" : "password"}
          isIdentityAvailable={showPamLogin}
        />
      )}
      {providersAvailable && (
        <AvailableProviderList
          isStandaloneOidcEnabled={isStandaloneOidcEnabled}
          isUbuntuOneEnabled={isUbuntuOneEnabled}
          oidcProviders={availableOidcProviders}
        />
      )}
      {isIdentityAvailable && isPasswordEnabled && (
        <div className={classes.loginModeSwitch}>
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom"
            onClick={() => {
              setUsePasswordLogin((prev) => !prev);
            }}
          >
            {showPamLogin
              ? "Log in with email and password instead"
              : "Log in with PAM instead"}
          </Button>
        </div>
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
