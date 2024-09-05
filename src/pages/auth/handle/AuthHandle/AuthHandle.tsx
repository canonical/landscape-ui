import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIdentityProviders } from "@/features/identity-providers";
import useAuth from "@/hooks/useAuth";
import { ROOT_PATH } from "@/constants";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./AuthHandle.module.scss";
import { Button } from "@canonical/react-components";

const AuthHandle: FC = () => {
  const { setUser } = useAuth();
  const { getAuthStateQuery } = useIdentityProviders();
  const { search } = useLocation();
  const navigate = useNavigate();

  const code = new URLSearchParams(search).get("code");
  const state = new URLSearchParams(search).get("state");

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
          <div>
            <LoadingState />
            <span>Please wait while your request is being processed...</span>
          </div>
        )}
        {getAuthStateQueryError && (
          <div className="u-align--center">
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
