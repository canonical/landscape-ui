import { FC, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIdentityProviders } from "@/features/identity-providers";
import useAuth from "@/hooks/useAuth";
import { ROOT_PATH } from "@/constants";
import classes from "./AuthHandle.module.scss";
import { Button } from "@canonical/react-components";

const AuthHandle: FC = () => {
  const [searchParams] = useSearchParams();

  const { setUser } = useAuth();
  const { getAuthStateQuery } = useIdentityProviders();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (!code || !state) {
      navigate(`${ROOT_PATH}login`, { replace: true });
    }
  }, [code, state]);

  const {
    data: getAuthStateQueryResult,
    isLoading: getAuthStateQueryLoading,
    error: getAuthStateQueryError,
  } = getAuthStateQuery(
    {
      code: code!,
      state: state!,
    },
    {
      enabled: !!code && !!state,
    },
  );

  useEffect(() => {
    if (!getAuthStateQueryResult) {
      return;
    }

    setUser(getAuthStateQueryResult.data);

    navigate(getAuthStateQueryResult.data.return_to ?? ROOT_PATH, {
      replace: true,
    });
  }, [getAuthStateQueryResult]);

  return (
    code &&
    state && (
      <div className={classes.container}>
        {getAuthStateQueryLoading && (
          <div className="u-align-text--center">
            <span role="status" style={{ marginRight: "1rem" }}>
              <span className="u-off-screen">Loading...</span>
              <i className="p-icon--spinner u-animation--spin" aria-hidden />
            </span>
            <span>Please wait while your request is being processed...</span>
          </div>
        )}
        {getAuthStateQueryError && (
          <div>
            <p>
              Oops! Something went wrong. Please try again or contact our
              support team.
            </p>
            <Button onClick={() => navigate(`${ROOT_PATH}login`)}>
              Back to login
            </Button>
          </div>
        )}
      </div>
    )
  );
};

export default AuthHandle;
