import type { FC } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { CONTACT_SUPPORT_TEAM_MESSAGE, HOMEPAGE_PATH } from "@/constants";
import { useUnsigned } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import classes from "./UbuntuOneAuthPage.module.scss";

const UbuntuOneAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { redirectToExternalUrl, setAuthLoading, setUser } = useAuth();
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
      setAuthLoading(true);
      setUser(getUbuntuOneStateQueryResult.data);

      const url = new URL(
        getUbuntuOneStateQueryResult.data.return_to?.url ?? HOMEPAGE_PATH,
        location.origin,
      );

      navigate(url.toString().replace(url.origin, ""), { replace: true });
    }
  }, [getUbuntuOneStateQueryResult, redirectToExternalUrl]);

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
          <p>{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
          <Link to="/login" className="p-button">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default UbuntuOneAuthPage;
