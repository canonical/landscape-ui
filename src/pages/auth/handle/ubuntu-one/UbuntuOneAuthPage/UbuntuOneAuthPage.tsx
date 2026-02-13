import type { FC } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  CONTACT_SUPPORT_TEAM_MESSAGE,
  GENERIC_DOMAIN,
  HOMEPAGE_PATH,
} from "@/constants";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { useGetStandaloneAccount } from "@/features/account-creation";
import classes from "./UbuntuOneAuthPage.module.scss";
import { ROUTES } from "@/libs/routes";
import { useGetUbuntuOneCompletion } from "@/features/auth";

const UbuntuOneAuthPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { safeRedirect, setUser } = useAuth();
  const { isSelfHosted, isSaas } = useEnv();
  const { accountExists } = useGetStandaloneAccount();

  const { authData, isLoading } = useGetUbuntuOneCompletion(
    window.location.toString(),
    searchParams.size > 0,
  );

  useEffect(() => {
    if (!authData || !("current_account" in authData)) {
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
      const isPublicSaas =
        isSaas && window.location.hostname === GENERIC_DOMAIN;
      const isPrivateInstance = isSelfHosted && !accountExists;

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
    authData,
    navigate,
    safeRedirect,
    setUser,
    isSelfHosted,
    accountExists,
    isSaas,
  ]);

  return (
    <div className={classes.container}>
      {isLoading ? (
        <div className="u-align-text--center">
          <span role="status" style={{ marginRight: "1rem" }}>
            <span className="u-off-screen">Loading...</span>
            <i className="p-icon--spinner u-animation--spin" aria-hidden />
          </span>
          <span>Please wait while your request is being processed...</span>
        </div>
      ) : (
        <div>
          <p>{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
          <Link to={ROUTES.auth.login()} className="p-button">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default UbuntuOneAuthPage;
