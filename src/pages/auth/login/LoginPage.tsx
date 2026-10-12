import type { FC } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import LoadingState from "@/components/layout/LoadingState";
import {
  ConsentBannerModal,
  LoginMethodsLayout,
  useGetLoginMethods,
} from "@/features/auth";
import { useGetStandaloneAccount } from "@/features/account-creation";
import AuthTemplate from "@/templates/auth";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import useEnv from "@/hooks/useEnv";
import { useBoolean } from "usehooks-ts";
import { ROUTES } from "@/libs/routes";

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { displayDisaStigBanner, isSelfHosted } = useEnv();
  const { value: bannerHidden, setTrue: hideBanner } = useBoolean();

  const { accountExists, isLoading: isCheckingStandaloneAccount } =
    useGetStandaloneAccount();

  const { loginMethods, loginMethodsLoading, isLoginMethodsError } =
    useGetLoginMethods();

  const needsFirstAdmin = isSelfHosted && !accountExists;
  const isFirstAdminSupported =
    Boolean(
      loginMethods?.password?.available && loginMethods.password.enabled,
    ) || Boolean(loginMethods?.pam?.available && loginMethods.pam.enabled);
  const allowFederatedLogin =
    (location.state as { allowFederatedLogin?: boolean } | null)
      ?.allowFederatedLogin === true;
  const shouldRedirect =
    needsFirstAdmin && isFirstAdminSupported && !allowFederatedLogin;

  useEffect(() => {
    if (isCheckingStandaloneAccount || loginMethodsLoading) {
      return;
    }

    if (shouldRedirect) {
      navigate(ROUTES.auth.createAccount(), { replace: true });
    }
  }, [
    isCheckingStandaloneAccount,
    loginMethodsLoading,
    navigate,
    shouldRedirect,
  ]);

  if (isCheckingStandaloneAccount || loginMethodsLoading || shouldRedirect) {
    return <LoadingState />;
  }

  return (
    <>
      {!bannerHidden && displayDisaStigBanner && (
        <ConsentBannerModal onClose={hideBanner} />
      )}
      <AuthTemplate title="Sign in to Landscape">
        {isLoginMethodsError ? (
          <p className="u-no-margin--bottom">{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
        ) : (
          <LoginMethodsLayout methods={loginMethods} />
        )}
      </AuthTemplate>
    </>
  );
};

export default LoginPage;
