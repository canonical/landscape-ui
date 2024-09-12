import { FC, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import { useIdentityProviders } from "@/features/identity-providers";
import useAuth from "@/hooks/useAuth";
import classes from "./UbuntuOneAuthPage.module.scss";

const UbuntuOneAuthPage: FC = () => {
  const [searchParams] = useSearchParams();

  const { setUser } = useAuth();
  const { getUbuntuOneStateQuery } = useIdentityProviders();
  const navigate = useNavigate();

  const client_id = searchParams.get("client_id");
  const url = searchParams.get("url");

  useEffect(() => {
    if (client_id && url) {
      return;
    }

    navigate(`${ROOT_PATH}login`, { replace: true });
  }, [client_id, url]);

  const {
    data: getUbuntuOneStateQueryResult,
    isLoading: getUbuntuOneStateQueryLoading,
    error: getUbuntuOneStateQueryError,
  } = getUbuntuOneStateQuery(
    {
      client_id: client_id!,
      url: url!,
    },
    { enabled: !!client_id && !!url },
  );

  useEffect(() => {
    if (!getUbuntuOneStateQueryResult) {
      return;
    }

    setUser(getUbuntuOneStateQueryResult.data);

    navigate(getUbuntuOneStateQueryResult.data.return_to ?? ROOT_PATH, {
      replace: true,
    });
  }, [getUbuntuOneStateQueryResult]);

  return (
    client_id &&
    url && (
      <div className={classes.container}>
        {getUbuntuOneStateQueryLoading && (
          <div className="u-align-text--center">
            <span role="status" style={{ marginRight: "1rem" }}>
              <span className="u-off-screen">Loading...</span>
              <i className="p-icon--spinner u-animation--spin" aria-hidden />
            </span>
            <span>Please wait while your request is being processed...</span>
          </div>
        )}
        {getUbuntuOneStateQueryError && (
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

export default UbuntuOneAuthPage;
