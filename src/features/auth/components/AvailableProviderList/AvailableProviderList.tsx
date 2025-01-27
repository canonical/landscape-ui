import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Button, Icon } from "@canonical/react-components";
import { IdentityProvider } from "../../types";
import {
  GetOidcUrlParams,
  GetUbuntuOneUrlParams,
  useInvitation,
  useUnsigned,
} from "../../hooks";
import { getProviderIcon, redirectToExternalUrl } from "../../helpers";
import classes from "./AvailableProviderList.module.scss";

interface AvailableProviderListProps {
  isStandaloneOidcEnabled: boolean;
  isUbuntuOneEnabled: boolean;
  oidcProviders: IdentityProvider[];
}

const AvailableProviderList: FC<AvailableProviderListProps> = ({
  isStandaloneOidcEnabled,
  isUbuntuOneEnabled,
  oidcProviders,
}) => {
  const [providerId, setProviderId] = useState(0);
  const [searchParams] = useSearchParams();
  const { invitationId } = useInvitation();

  const { getOidcUrlQuery, getUbuntuOneUrlQuery } = useUnsigned();

  const redirectTo = searchParams.get("redirect-to");
  const external = searchParams.has("external");

  const params: GetOidcUrlParams = {};

  if (providerId > 0) {
    params.id = providerId;
  }

  if (redirectTo) {
    params.return_to = redirectTo;
  }

  if (invitationId) {
    params.invitation_id = invitationId;
  }

  if (external) {
    params.external = true;
  }

  const { data: getOidcUrlQueryResult } = getOidcUrlQuery(params, {
    enabled: providerId !== 0,
  });

  useEffect(() => {
    if (!getOidcUrlQueryResult) {
      return;
    }

    redirectToExternalUrl(getOidcUrlQueryResult.data.location);
  }, [getOidcUrlQueryResult]);

  const ubuntuOneParams: GetUbuntuOneUrlParams = {};

  if (redirectTo) {
    ubuntuOneParams.return_to = `${window.origin}${redirectTo}`;
  }

  if (invitationId) {
    ubuntuOneParams.invitation_id = invitationId;
  }

  if (external) {
    ubuntuOneParams.external = true;
  }

  const {
    data: getUbuntuOneUrlQueryResult,
    refetch: refetchGetUbuntuOneUrlQuery,
  } = getUbuntuOneUrlQuery(ubuntuOneParams, { enabled: false });

  useEffect(() => {
    if (!getUbuntuOneUrlQueryResult) {
      return;
    }

    redirectToExternalUrl(getUbuntuOneUrlQueryResult.data.location);
  }, [getUbuntuOneUrlQueryResult]);

  return (
    <ul className={classes.list}>
      {isUbuntuOneEnabled && (
        <li className="p-list__item">
          <Button
            type="button"
            hasIcon
            onClick={refetchGetUbuntuOneUrlQuery}
            className={classes.button}
          >
            <Icon
              name={getProviderIcon("ubuntu-one")}
              className={classes.icon}
            />
            <span>Sign in with Ubuntu One</span>
          </Button>
        </li>
      )}
      {isStandaloneOidcEnabled && (
        <li className="p-list__item">
          <Button
            type="button"
            hasIcon
            onClick={() => setProviderId(-1)}
            className={classes.button}
          >
            <Icon
              name={getProviderIcon("standalone")}
              className={classes.icon}
            />
            <span>Sign in with Enterprise Login</span>
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
            <Icon
              name={getProviderIcon(provider.provider)}
              className={classes.icon}
            />
            <span>{`Sign in with ${provider.name}`}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default AvailableProviderList;
