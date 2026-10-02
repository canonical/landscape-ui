import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import {
  AccountCreationSaaSForm,
  AccountCreationSelfHostedForm,
} from "@/features/account-creation";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { HOMEPAGE_PATH } from "@/constants";
import { ROUTES } from "@/libs/routes";
import EnvError from "@/pages/EnvError";

const AccountCreationPage: FC = () => {
  const { authorized, authLoading, hasAccounts } = useAuth();
  const { isSelfHosted, envLoading, envError } = useEnv();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || envLoading || envError) {
      return;
    }

    if (!isSelfHosted && !authorized) {
      navigate(ROUTES.auth.login(), { replace: true });
      return;
    }

    if (hasAccounts) {
      navigate(HOMEPAGE_PATH, { replace: true });
    }
  }, [
    authorized,
    authLoading,
    envLoading,
    envError,
    hasAccounts,
    isSelfHosted,
    navigate,
  ]);

  if (envError) {
    return <EnvError />;
  }

  if (authLoading || envLoading) {
    return <LoadingState />;
  }

  if (!isSelfHosted && !authorized) {
    return <Redirecting />;
  }

  if (isSelfHosted) {
    return <AccountCreationSelfHostedForm />;
  }

  return <AccountCreationSaaSForm />;
};

export default AccountCreationPage;
