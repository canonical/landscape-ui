import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getProviderIcon, redirectToExternalUrl } from "../../helpers";
import type { GetUbuntuOneUrlParams } from "../../hooks";
import { useInvitation, useUnsigned } from "../../hooks";
import type { IdentityProvider } from "../../types";
import classes from "./AvailableProviderList.module.scss";
import classNames from "classnames";
import type { GetOidcUrlParams } from "../../api";
import { useGetOidcUrlQuery } from "../../api";

interface AvailableProviderListProps {
  readonly isStandaloneOidcEnabled: boolean;
  readonly isUbuntuOneEnabled: boolean;
  readonly oidcProviders: IdentityProvider[];
}

const AvailableProviderList: FC<AvailableProviderListProps> = ({
  isStandaloneOidcEnabled,
  isUbuntuOneEnabled,
  oidcProviders,
}) => {
  const [providerId, setProviderId] = useState(0);
  const [searchParams] = useSearchParams();
  const { invitationId } = useInvitation();
  const { getUbuntuOneUrlQuery } = useUnsigned();

  const redirectTo = searchParams.get("redirect-to");
  const external = searchParams.has("external");
  const code = searchParams.get("code");

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

  if (code) {
    params.attach_code = code;
  }

  const { oidcUrlLocation } = useGetOidcUrlQuery(params, {
    enabled: providerId !== 0,
  });

  useEffect(() => {
    if (!oidcUrlLocation) {
      return;
    }

    redirectToExternalUrl(oidcUrlLocation);
  }, [oidcUrlLocation]);

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
    <>
      {code && (
        <p className="u-no-margin--bottom u-text--muted">
          Sign in with your Identity provider to complete the attachment
          process.
        </p>
      )}
      <ul
        className={classNames(classes.list, {
          [classes["list__bordered"]]: !code,
        })}
      >
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
              onClick={() => {
                setProviderId(-1);
              }}
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
              onClick={() => {
                setProviderId(provider.id);
              }}
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
    </>
  );
};

export default AvailableProviderList;
