import { FC, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import { useUnsigned } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import classes from "./OidcAuthPage.module.scss";

const OidcAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { setUser, redirectToExternalUrl } = useAuth();
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
      setUser(getAuthStateQueryResult.data);

      const url = new URL(
        getAuthStateQueryResult.data.return_to?.url ?? `${ROOT_PATH}overview`,
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
          <p>
            Oops! Something went wrong. Please try again or contact our support
            team.
          </p>
          <Link to={`${ROOT_PATH}login`} className="p-button">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default OidcAuthPage;
