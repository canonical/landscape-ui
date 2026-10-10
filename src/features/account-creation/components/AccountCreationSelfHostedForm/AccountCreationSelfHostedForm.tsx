import type { FC } from "react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import { CONTACT_SUPPORT_TEAM_MESSAGE, HOMEPAGE_PATH } from "@/constants";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/libs/routes";

import type { LoginRequestParams } from "@/features/auth";
import type { AuthStateResponse } from "@/features/auth";
import { useGetLoginMethods, useLogin } from "@/features/auth";
import { useCreateStandaloneAccount } from "../../api";
import PamAccountCreationForm from "./components/PamAccountCreationForm";
import PasswordAccountCreationForm from "./components/PasswordAccountCreationForm";

const AccountCreationSelfHostedForm: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  const { createStandaloneAccount, isCreatingStandaloneAccount } =
    useCreateStandaloneAccount();

  const { login: signIn } = useLogin();

  const { loginMethods, loginMethodsLoading, isLoginMethodsError } =
    useGetLoginMethods();

  const isPamEnabled = Boolean(
    loginMethods?.pam.available && loginMethods.pam.enabled,
  );
  const isPasswordEnabled = Boolean(
    loginMethods?.password.available && loginMethods.password.enabled,
  );
  const isOidcEnabled = Boolean(
    loginMethods?.standalone_oidc.available &&
    loginMethods.standalone_oidc.enabled,
  );
  const isUbuntuOneEnabled = Boolean(
    loginMethods?.ubuntu_one.available && loginMethods.ubuntu_one.enabled,
  );
  const isGenericOidcEnabled = Boolean(
    loginMethods?.oidc.available &&
    loginMethods.oidc.configurations.some(({ enabled }) => enabled),
  );
  const hasOidcLoginMethod = isOidcEnabled || isGenericOidcEnabled;
  const hasFederatedLoginMethod = hasOidcLoginMethod || isUbuntuOneEnabled;
  const shouldRedirectToLogin =
    !isPamEnabled && !isPasswordEnabled && hasFederatedLoginMethod;

  useEffect(() => {
    if (!shouldRedirectToLogin) {
      return;
    }

    navigate(ROUTES.auth.login(), {
      replace: true,
      state: { allowFederatedLogin: true },
    });
  }, [navigate, shouldRedirectToLogin]);

  const signInAfterCreation = async (credentials: LoginRequestParams) => {
    let data: AuthStateResponse;
    try {
      ({ data } = await signIn(credentials));
    } catch (error) {
      await queryClient.invalidateQueries({
        queryKey: ["standaloneAccount"],
      });
      throw error;
    }

    if ("current_account" in data) {
      setUser(data);
      navigate(HOMEPAGE_PATH, { replace: true });
    } else {
      navigate(ROUTES.auth.login(), { replace: true });
    }
  };

  if (loginMethodsLoading) {
    return <LoadingState />;
  }

  if (isLoginMethodsError) {
    return (
      <AuthTemplate title="Unable to create a new Landscape account">
        <p className="u-no-margin--bottom">{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
      </AuthTemplate>
    );
  }

  if (shouldRedirectToLogin) {
    return <Redirecting />;
  }

  if (isPamEnabled) {
    return (
      <PamAccountCreationForm
        createStandaloneAccount={createStandaloneAccount}
        signInAfterCreation={signInAfterCreation}
        submitting={isCreatingStandaloneAccount}
        oidcEnabled={hasOidcLoginMethod}
        ubuntuOneEnabled={isUbuntuOneEnabled}
      />
    );
  }

  if (!isPasswordEnabled) {
    return (
      <AuthTemplate title="Unable to create a new Landscape account">
        <p className="u-margin--bottom">
          No login methods are configured. Ask your system administrator to
          configure password, PAM, OIDC, or Ubuntu One.
        </p>
      </AuthTemplate>
    );
  }

  return (
    <PasswordAccountCreationForm
      createStandaloneAccount={createStandaloneAccount}
      signInAfterCreation={signInAfterCreation}
      submitting={isCreatingStandaloneAccount}
      oidcEnabled={hasOidcLoginMethod}
      ubuntuOneEnabled={isUbuntuOneEnabled}
    />
  );
};

export default AccountCreationSelfHostedForm;
