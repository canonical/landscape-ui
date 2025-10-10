import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
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
  const { displayDisaStigBanner, isSelfHosted } = useEnv();
  const { value: bannerHidden, setTrue: hideBanner } = useBoolean();

  const { accountExists, isLoading: isCheckingStandaloneAccount } =
    useGetStandaloneAccount();

  const { loginMethods, loginMethodsLoading, isLoginMethodsError } =
    useGetLoginMethods();

  useEffect(() => {
    if (!isSelfHosted) {
      return;
    }

    if (isCheckingStandaloneAccount || loginMethodsLoading) {
      return;
    }

    const needsFirstAdmin = !accountExists;
    const isPasswordAuthEnabled = loginMethods?.password?.enabled ?? false;

    if (needsFirstAdmin && isPasswordAuthEnabled) {
      navigate(ROUTES.auth.createAccount(), { replace: true });
    }
  }, [
    isSelfHosted,
    accountExists,
    isCheckingStandaloneAccount,
    loginMethods,
    loginMethodsLoading,
    navigate,
  ]);

  const needsFirstAdmin = isSelfHosted && !accountExists;
  const isPasswordAuthEnabled = loginMethods?.password?.enabled ?? false;
  const shouldRedirect = needsFirstAdmin && isPasswordAuthEnabled;

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
