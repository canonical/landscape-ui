import { FC, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import { useAuthHandle } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import classes from "./UbuntuOneAuthPage.module.scss";

const UbuntuOneAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { setUser } = useAuth();
  const { getAuthStateWithUbuntuOneQuery } = useAuthHandle();
  const navigate = useNavigate();

  const {
    data: getUbuntuOneStateQueryResult,
    isLoading: getUbuntuOneStateQueryLoading,
    error: getUbuntuOneStateQueryError,
  } = getAuthStateWithUbuntuOneQuery(
    { url: window.location.toString() },
    { enabled: searchParams.size > 0 },
  );

  useEffect(() => {
    if (!getUbuntuOneStateQueryResult) {
      return;
    }

    if (getUbuntuOneStateQueryResult.data.return_to?.external) {
      window.location.replace(
        getUbuntuOneStateQueryResult.data.return_to.url ?? ROOT_PATH,
      );
    } else {
      setUser(getUbuntuOneStateQueryResult.data);

      const url = new URL(
        getUbuntuOneStateQueryResult.data.return_to?.url ?? ROOT_PATH,
        location.origin,
      );

      navigate(url.toString().replace(url.origin, ""), { replace: true });
    }
  }, [getUbuntuOneStateQueryResult]);

  return (
    <div className={classes.container}>
      {searchParams.size > 0 && getUbuntuOneStateQueryLoading && (
        <div className="u-align-text--center">
          <span role="status" style={{ marginRight: "1rem" }}>
            <span className="u-off-screen">Loading...</span>
            <i className="p-icon--spinner u-animation--spin" aria-hidden />
          </span>
          <span>Please wait while your request is being processed...</span>
        </div>
      )}
      {(searchParams.size === 0 ||
        (!getUbuntuOneStateQueryLoading && getUbuntuOneStateQueryError)) && (
        <div>
          <p>
            Oops! Something went wrong. Please try again or contact our support
            team.
          </p>
          <Button onClick={() => navigate(`${ROOT_PATH}login`)}>
            Back to login
          </Button>
        </div>
      )}
    </div>
  );
};

export default UbuntuOneAuthPage;
