import { FC, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import { redirectToExternalUrl, useAuthHandle } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import classes from "./OidcAuthPage.module.scss";

const OidcAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { setUser } = useAuth();
  const { getAuthStateWithOidcQuery } = useAuthHandle();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const {
    data: getAuthStateQueryResult,
    isLoading: getAuthStateQueryLoading,
    error: getAuthStateQueryError,
  } = getAuthStateWithOidcQuery(
    { code: code!, state: state! },
    { enabled: !!code && !!state },
  );

  useEffect(() => {
    if (!getAuthStateQueryResult) {
      return;
    }

    if (getAuthStateQueryResult.data.return_to?.external) {
      redirectToExternalUrl(
        getAuthStateQueryResult.data.return_to.url ?? ROOT_PATH,
        { replace: true },
      );
    } else {
      setUser(getAuthStateQueryResult.data);

      const url = new URL(
        getAuthStateQueryResult.data.return_to?.url ?? ROOT_PATH,
        location.origin,
      );

      navigate(url.toString().replace(url.origin, ""), { replace: true });
    }
  }, [getAuthStateQueryResult]);

  return (
    <div className={classes.container}>
      {code && state && getAuthStateQueryLoading && (
        <div className="u-align-text--center">
          <span role="status" style={{ marginRight: "1rem" }}>
            <span className="u-off-screen">Loading...</span>
            <i className="p-icon--spinner u-animation--spin" aria-hidden />
          </span>
          <span>Please wait while your request is being processed...</span>
        </div>
      )}
      {(!code ||
        !state ||
        (!getAuthStateQueryLoading && getAuthStateQueryError)) && (
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
