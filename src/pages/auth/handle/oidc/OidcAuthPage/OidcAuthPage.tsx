import type { FC } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  CONTACT_SUPPORT_TEAM_MESSAGE,
  GENERIC_DOMAIN,
  HOMEPAGE_PATH,
} from "@/constants";
import { useUnsigned } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { useGetStandaloneAccount } from "@/features/account-creation";
import classes from "./OidcAuthPage.module.scss";
import { ROUTES } from "@/libs/routes";

const OidcAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { redirectToExternalUrl, setAuthLoading, setUser } = useAuth();
  const { getAuthStateWithOidcQuery } = useUnsigned();
  const { isSelfHosted, isSaas } = useEnv();
  const { accountExists } = useGetStandaloneAccount();
  const navigate = useNavigate();

  const code = searchParams.get("code") ?? "";
  const state = searchParams.get("state") ?? "";

  const { data: getAuthStateQueryResult, isLoading: getAuthStateQueryLoading } =
    getAuthStateWithOidcQuery({ code, state }, { enabled: !!code && !!state });

  useEffect(() => {
    if (
      !getAuthStateQueryResult ||
      !("current_account" in getAuthStateQueryResult.data)
    ) {
      return;
    }

    if (getAuthStateQueryResult.data.attach_code) {
      navigate(ROUTES.auth.attach(), {
        replace: true,
        state: { success: true },
      });
      return;
    }

    setAuthLoading(true);
    setUser(getAuthStateQueryResult.data);

    if (getAuthStateQueryResult.data.invitation_id) {
      navigate(
        ROUTES.auth.invitation({
          secureId: getAuthStateQueryResult.data.invitation_id,
        }),
        { replace: true },
      );
      return;
    }

    if (getAuthStateQueryResult.data.accounts.length === 0) {
      if (
        (isSaas && window.location.hostname === GENERIC_DOMAIN) ||
        (isSelfHosted && !accountExists)
      ) {
        navigate(ROUTES.auth.createAccount(), { replace: true });
      } else {
        navigate(ROUTES.auth.noAccess(), { replace: true });
      }
      return;
    }

    const returnToUrl = getAuthStateQueryResult.data.return_to?.url;

    if (
      getAuthStateQueryResult.data.return_to?.external &&
      getAuthStateQueryResult.data.return_to.url
    ) {
      redirectToExternalUrl(getAuthStateQueryResult.data.return_to.url, {
        replace: true,
      });
    } else {
      const url = new URL(returnToUrl ?? HOMEPAGE_PATH, location.origin);

      navigate(url.toString().replace(url.origin, ""), { replace: true });
    }
  }, [
    getAuthStateQueryResult,
    redirectToExternalUrl,
    navigate,
    setAuthLoading,
    setUser,
    isSelfHosted,
    accountExists,
    isSaas,
  ]);

  return (
    <div className={classes.container}>
      {getAuthStateQueryLoading ? (
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

export default OidcAuthPage;
