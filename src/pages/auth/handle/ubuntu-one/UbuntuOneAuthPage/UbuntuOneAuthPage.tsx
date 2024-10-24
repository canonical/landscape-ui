import { FC, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import { redirectToExternalUrl, useUnsigned } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import classes from "./UbuntuOneAuthPage.module.scss";

const UbuntuOneAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { setUser } = useAuth();
  const { getAuthStateWithUbuntuOneQuery } = useUnsigned();
  const navigate = useNavigate();

  const {
    data: getUbuntuOneStateQueryResult,
    isLoading: getUbuntuOneStateQueryLoading,
  } = getAuthStateWithUbuntuOneQuery(
    { url: window.location.toString() },
    { enabled: searchParams.size > 0 },
  );

  useEffect(() => {
    if (
      !getUbuntuOneStateQueryResult ||
      !("current_account" in getUbuntuOneStateQueryResult.data)
    ) {
      return;
    }

    if (
      getUbuntuOneStateQueryResult.data.return_to?.external &&
      getUbuntuOneStateQueryResult.data.return_to.url
    ) {
      redirectToExternalUrl(getUbuntuOneStateQueryResult.data.return_to.url, {
        replace: true,
      });
    } else {
      setUser(getUbuntuOneStateQueryResult.data);

      const url = new URL(
        getUbuntuOneStateQueryResult.data.return_to?.url ??
          `${ROOT_PATH}overview`,
        location.origin,
      );

      navigate(url.toString().replace(url.origin, ""), { replace: true });
    }
  }, [getUbuntuOneStateQueryResult]);

  return (
    <div className={classes.container}>
      {getUbuntuOneStateQueryLoading ? (
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

export default UbuntuOneAuthPage;
