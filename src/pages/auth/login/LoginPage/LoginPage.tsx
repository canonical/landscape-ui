import { FC, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { AvailableProviderList, LoginForm, useUnsigned } from "@/features/auth";
import AuthTemplate from "@/templates/auth";

const LoginPage: FC = () => {
  const [invitationAccount, setInvitationAccount] = useState("");

  const { getLoginMethodsQuery } = useUnsigned();

  const { data: getLoginMethodsQueryResult, isLoading } =
    getLoginMethodsQuery();

  const availableOidcProviders = getLoginMethodsQueryResult?.data.oidc.available
    ? getLoginMethodsQueryResult?.data.oidc.configurations.filter(
        ({ enabled }) => enabled,
      )
    : [];

  const isStandaloneOidcEnabled = !!(
    getLoginMethodsQueryResult?.data.standalone_oidc.available &&
    getLoginMethodsQueryResult.data.standalone_oidc.enabled
  );

  const isUbuntuOneEnabled = !!(
    getLoginMethodsQueryResult?.data.ubuntu_one.available &&
    getLoginMethodsQueryResult.data.ubuntu_one.enabled
  );

  const isPasswordEnabled = !!(
    getLoginMethodsQueryResult?.data.password.available &&
    getLoginMethodsQueryResult.data.password.enabled
  );

  const isEmailIdentityOnly = !!(
    getLoginMethodsQueryResult?.data.pam.available &&
    getLoginMethodsQueryResult.data.pam.enabled
  );

  const noMethodsAvailable =
    !isLoading &&
    !isPasswordEnabled &&
    !isUbuntuOneEnabled &&
    !isStandaloneOidcEnabled &&
    !availableOidcProviders.length;

  const providersAvailable =
    !isLoading &&
    (isUbuntuOneEnabled ||
      isStandaloneOidcEnabled ||
      availableOidcProviders.length > 0);

  const loginFormAvailable =
    !isLoading && (isPasswordEnabled || isEmailIdentityOnly);

  return (
    <AuthTemplate
      invitationAccount={invitationAccount}
      title="Sign in to Landscape"
    >
      {isLoading && <LoadingState />}
      {loginFormAvailable && (
        <LoginForm isEmailIdentityOnly={isEmailIdentityOnly} />
      )}
      {providersAvailable && (
        <AvailableProviderList
          isStandaloneOidcEnabled={isStandaloneOidcEnabled}
          isUbuntuOneEnabled={isUbuntuOneEnabled}
          oidcProviders={availableOidcProviders}
          onInvitation={(accountTitle) => setInvitationAccount(accountTitle)}
        />
      )}
      {noMethodsAvailable && (
        <span>
          It seems like you have no way to get in. Please contact our support
          team.
        </span>
      )}
    </AuthTemplate>
  );
};

export default LoginPage;
