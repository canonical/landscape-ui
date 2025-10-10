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

const AccountCreationPage: FC = () => {
  const { authorized, authLoading, hasAccounts } = useAuth();
  const { isSelfHosted, envLoading } = useEnv();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || envLoading) {
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
    hasAccounts,
    isSelfHosted,
    navigate,
  ]);

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
