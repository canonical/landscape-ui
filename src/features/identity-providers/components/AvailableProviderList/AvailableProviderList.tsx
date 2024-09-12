import { FC, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Icon } from "@canonical/react-components";
import { IdentityProvider } from "@/features/identity-providers";
import { SUPPORTED_PROVIDERS } from "../../constants";
import {
  GetAuthUrlParams,
  GetUbuntuOneUrlParams,
  useIdentityProviders,
} from "../../hooks";
import classes from "./AvailableProviderList.module.scss";

interface AvailableProviderListProps {
  isUbuntuOneEnabled: boolean;
  oidcProviders: IdentityProvider[];
}

const AvailableProviderList: FC<AvailableProviderListProps> = ({
  isUbuntuOneEnabled,
  oidcProviders,
}) => {
  const [providerId, setProviderId] = useState(0);
  const [searchParams] = useSearchParams();

  const { getAuthUrlQuery, getUbuntuOneUrlQuery } = useIdentityProviders();

  const redirectTo = searchParams.get("redirect-to");
  const open = searchParams.get("open") === "true";

  const params: GetAuthUrlParams = { id: providerId };

  if (redirectTo) {
    params.return_to = redirectTo;
  }

  const { data: getAuthUrlQueryResult } = getAuthUrlQuery(params, {
    enabled: providerId > 0,
  });

  if (getAuthUrlQueryResult) {
    open
      ? window.open(getAuthUrlQueryResult.data.location, "_self")?.focus()
      : (window.location.href = getAuthUrlQueryResult.data.location);
  }

  const ubuntuOneParams: GetUbuntuOneUrlParams = {};

  if (redirectTo) {
    ubuntuOneParams.return_to = redirectTo;
  }

  const { data: getUbuntuOneUrlQueryResult } = getUbuntuOneUrlQuery(
    ubuntuOneParams,
    { enabled: providerId === -1 },
  );

  if (getUbuntuOneUrlQueryResult) {
    open
      ? window.open(getUbuntuOneUrlQueryResult.data.location, "_self")?.focus()
      : (window.location.href = getUbuntuOneUrlQueryResult.data.location);
  }

  return (
    <ul className={classes.list}>
      {isUbuntuOneEnabled && (
        <li className="p-list__item">
          <Button
            type="button"
            hasIcon
            onClick={() => setProviderId(-1)}
            className={classes.button}
          >
            <Icon name={SUPPORTED_PROVIDERS["ubuntu-one"].icon} />
            <span>Ubuntu One</span>
          </Button>
        </li>
      )}
      {oidcProviders.map((provider) => (
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
  );
};

export default AvailableProviderList;
