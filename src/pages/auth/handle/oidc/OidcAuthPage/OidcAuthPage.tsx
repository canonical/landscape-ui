import type { FC } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  CONTACT_SUPPORT_TEAM_MESSAGE,
  GENERIC_DOMAIN,
  HOMEPAGE_PATH,
} from "@/constants";
import LoadingState from "@/components/layout/LoadingState";
import { useGetOidcAuth } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { useGetStandaloneAccount } from "@/features/account-creation";
import classes from "./OidcAuthPage.module.scss";
import { ROUTES } from "@/libs/routes";
import EnvError from "@/pages/EnvError";

const OidcAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { safeRedirect, setUser } = useAuth();
  const { envLoading, envError, isSelfHosted, isSaas } = useEnv();
  const { accountExists, isLoading: standaloneAccountLoading } =
    useGetStandaloneAccount();
  const navigate = useNavigate();

  const code = searchParams.get("code") ?? "";
  const state = searchParams.get("state") ?? "";

  const { authData, isLoading } = useGetOidcAuth(
    { code, state },
    !!code && !!state,
  );
  const needsEnvironmentDecision =
    !!authData &&
    "current_account" in authData &&
    authData.accounts.length === 0 &&
    !authData.invitation_id &&
    !authData.attach_code;

  useEffect(() => {
    if (!authData || !("current_account" in authData)) {
      return;
    }

    if (authData.attach_code) {
      navigate(ROUTES.auth.attach(), {
        replace: true,
        state: { success: true },
      });
      return;
    }

    setUser(authData);

    if (authData.invitation_id) {
      navigate(
        ROUTES.auth.invitation({
          secureId: authData.invitation_id,
        }),
        { replace: true },
      );
      return;
    }

    if (authData.accounts.length === 0) {
      if (envLoading || envError) {
        return;
      }

      if (
        isSelfHosted &&
        (standaloneAccountLoading || accountExists === undefined)
      ) {
        return;
      }

      const isPublicSaas =
        isSaas && window.location.hostname === GENERIC_DOMAIN;
      const isPrivateInstance = isSelfHosted && accountExists === false;

      if (isPublicSaas || isPrivateInstance) {
        navigate(ROUTES.auth.createAccount(), { replace: true });
      } else {
        navigate(ROUTES.auth.noAccess(), { replace: true });
      }
      return;
    }

    safeRedirect(authData.return_to?.url ?? HOMEPAGE_PATH, {
      external: authData.return_to?.external ?? false,
      replace: true,
    });
  }, [
    envLoading,
    envError,
    authData,
    navigate,
    safeRedirect,
    setUser,
    isSelfHosted,
    accountExists,
    standaloneAccountLoading,
    isSaas,
  ]);

  if (envError && needsEnvironmentDecision) {
    return <EnvError />;
  }

  const isWaitingForEnvironment = needsEnvironmentDecision && envLoading;
  const isWaitingForStandaloneAccount =
    needsEnvironmentDecision && isSelfHosted && standaloneAccountLoading;
  const isRoutingAuthResponse =
    !!authData && "current_account" in authData && !needsEnvironmentDecision;

  return (
    <div className={classes.container}>
      {isLoading ||
      isWaitingForEnvironment ||
      isWaitingForStandaloneAccount ||
      isRoutingAuthResponse ? (
        <div className="u-align-text--center">
          <span className={classes.loading}>
            <LoadingState inline />
          </span>
          <span>Please wait while your request is being processed...</span>
        </div>
      ) : (
        <div>
          <p className="u-margin--bottom">{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
          <Link to={ROUTES.auth.login()} className="p-button">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default OidcAuthPage;
