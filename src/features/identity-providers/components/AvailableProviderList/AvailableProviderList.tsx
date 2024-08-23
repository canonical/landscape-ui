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
  const { getProvidersQuery, getAuthUrlQuery } = useIdentityProviders();
  const { search } = useLocation();

  const return_to = new URLSearchParams(search).get("redirect");

  const params: GetAuthUrlParams = { id: providerId };

  if (return_to) {
    params.return_to = return_to;
  }

  const { data: getAuthUrlQueryResult } = getAuthUrlQuery(params, {
    enabled: providerId !== 0,
  });

  if (getAuthUrlQueryResult) {
    window.open(getAuthUrlQueryResult.data.location, "_self")?.focus();
  }

  const { data: identityProviders, isLoading } = getProvidersQuery(
    { account_name: account ?? "" },
    { enabled: !!account },
  );

  const availableProviders =
    identityProviders?.data.results.filter(({ enabled }) => enabled) ?? [];

  if (!account || availableProviders.length === 0) {
    return null;
  }

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading &&
        identityProviders &&
        identityProviders.data.results.length > 0 && (
          <>
            <p className={classes.divider}>OR</p>
            <ul className={classes.list}>
              {availableProviders.map((provider) => (
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
