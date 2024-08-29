import { FC, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { SUPPORTED_PROVIDERS } from "../../constants";
import { GetAuthUrlParams, useIdentityProviders } from "../../hooks";
import classes from "./AvailableProviderList.module.scss";

const AvailableProviderList: FC = () => {
  const [providerId, setProviderId] = useState(0);

  const { account } = useParams();
  const { getAuthMethodsQuery, getAuthUrlQuery } = useIdentityProviders();
  const { search } = useLocation();

  const return_to = new URLSearchParams(search).get("redirect-to");
  const open = new URLSearchParams(search).get("open") === "true";

  const params: GetAuthUrlParams = { id: providerId };

  if (return_to) {
    params.return_to = return_to;
  }

  const { data: getAuthUrlQueryResult } = getAuthUrlQuery(params, {
    enabled: providerId !== 0,
  });

  if (getAuthUrlQueryResult) {
    open
      ? window.open(getAuthUrlQueryResult.data.location, "_self")?.focus()
      : (window.location.href = getAuthUrlQueryResult.data.location);
  }

  const { data: getAuthMethodsQueryResult, isLoading } = getAuthMethodsQuery();

  const availableOidcProviders =
    getAuthMethodsQueryResult?.data.oidc.filter(({ enabled }) => enabled) ?? [];

  if (!account || availableOidcProviders.length === 0) {
    return null;
  }

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading &&
        (availableOidcProviders.length > 0 ||
          getAuthMethodsQueryResult?.data["ubuntu-one"].enabled) && (
          <>
            <p className={classes.divider}>OR</p>
            <ul className={classes.list}>
              {getAuthMethodsQueryResult?.data["ubuntu-one"].enabled && (
                <li className="p-list__item">
                  <Button
                    type="button"
                    hasIcon
                    onClick={() => undefined}
                    className={classes.button}
                  >
                    <Icon name={SUPPORTED_PROVIDERS["ubuntu-one"].icon} />
                    <span>Ubuntu One</span>
                  </Button>
                </li>
              )}
              {availableOidcProviders.map((provider) => (
                <li key={provider.id} className="p-list__item">
                  <Button
                    type="button"
                    hasIcon
                    onClick={() => setProviderId(provider.id)}
                    className={classes.button}
                  >
                    <Icon name={SUPPORTED_PROVIDERS[provider.provider].icon} />
                    <span>{provider.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
    </>
  );
};

export default AvailableProviderList;
