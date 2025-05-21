import type { FC } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { useUnsigned } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import classes from "./OidcAuthPage.module.scss";
import { ROUTES } from "@/libs/routes";

const OidcAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { redirectToExternalUrl, setAuthLoading, setUser } = useAuth();
  const { getAuthStateWithOidcQuery } = useUnsigned();
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

    if (
      getAuthStateQueryResult.data.return_to?.external &&
      getAuthStateQueryResult.data.return_to.url
    ) {
      redirectToExternalUrl(getAuthStateQueryResult.data.return_to.url, {
        replace: true,
      });
    } else {
      setAuthLoading(true);
      setUser(getAuthStateQueryResult.data);

      const url = new URL(
        getAuthStateQueryResult.data.return_to?.url ?? ROUTES.overview(),
        location.origin,
      );

      navigate(url.toString().replace(url.origin, ""), { replace: true });
    }
  }, [getAuthStateQueryResult, redirectToExternalUrl]);

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
          <Link to={ROUTES.login()} className="p-button">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default OidcAuthPage;
