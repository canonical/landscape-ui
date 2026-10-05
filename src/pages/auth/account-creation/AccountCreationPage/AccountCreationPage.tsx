import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import {
  AccountCreationSaaSForm,
  AccountCreationSelfHostedForm,
  useGetStandaloneAccount,
} from "@/features/account-creation";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { HOMEPAGE_PATH } from "@/constants";
import { ROUTES } from "@/libs/routes";

const AccountCreationPage: FC = () => {
  const { authorized, authLoading, hasAccounts } = useAuth();
  const { isSelfHosted, envLoading } = useEnv();
  const {
    accountExists: standaloneAccountExists,
    isLoading: standaloneAccountLoading,
  } = useGetStandaloneAccount();
  const navigate = useNavigate();
  const shouldRedirectToLogin =
    (!isSelfHosted && !authorized) ||
    (isSelfHosted && standaloneAccountExists && !hasAccounts);

  useEffect(() => {
    if (authLoading || envLoading || standaloneAccountLoading) {
      return;
    }

    if (shouldRedirectToLogin) {
      navigate(ROUTES.auth.login(), { replace: true });
      return;
    }

    if (hasAccounts) {
      navigate(HOMEPAGE_PATH, { replace: true });
      return;
    }
  }, [
    authorized,
    authLoading,
    envLoading,
    hasAccounts,
    isSelfHosted,
    navigate,
    shouldRedirectToLogin,
    standaloneAccountExists,
    standaloneAccountLoading,
  ]);

  if (authLoading || envLoading || standaloneAccountLoading) {
    return <LoadingState />;
  }

  if (shouldRedirectToLogin) {
    return <Redirecting />;
  }

  if (isSelfHosted) {
    return <AccountCreationSelfHostedForm />;
  }

  return <AccountCreationSaaSForm />;
};

export default AccountCreationPage;
