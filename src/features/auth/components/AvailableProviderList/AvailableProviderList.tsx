import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getProviderIcon, redirectToExternalUrl } from "../../helpers";
import type { IdentityProvider } from "../../types";
import {
  type GetUbuntuOneUrlParams,
  useGetUbuntuOneUrl,
} from "@/features/auth";
import { useInvitation } from "../../hooks";
import { type GetOidcUrlParams, useGetOidcUrlQuery } from "../../api";
import classes from "./AvailableProviderList.module.scss";

export interface AvailableProviderListProps {
  readonly isStandaloneOidcEnabled: boolean;
  readonly isUbuntuOneEnabled: boolean;
  readonly oidcProviders: IdentityProvider[];
}

export const AvailableProviderList: FC<AvailableProviderListProps> = ({
  isStandaloneOidcEnabled,
  isUbuntuOneEnabled,
  oidcProviders,
}) => {
  const [providerId, setProviderId] = useState(0);
  const [isUbuntuOneRequested, setIsUbuntuOneRequested] = useState(false);

  const [searchParams] = useSearchParams();
  const { invitationId } = useInvitation();

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
    params.return_to = `/accept-invitation/${invitationId}`;
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
    ubuntuOneParams.return_to = `/accept-invitation/${invitationId}`;
  }

  if (external) {
    ubuntuOneParams.external = true;
  }

  const { location: ubuntuOneUrl, isLoading: isUbuntuOneLoading } =
    useGetUbuntuOneUrl(ubuntuOneParams, isUbuntuOneRequested);

  useEffect(() => {
    if (!ubuntuOneUrl) {
      return;
    }
    redirectToExternalUrl(ubuntuOneUrl);
  }, [ubuntuOneUrl]);

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
              disabled={isUbuntuOneLoading}
              onClick={() => {
                setIsUbuntuOneRequested(true);
              }}
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
