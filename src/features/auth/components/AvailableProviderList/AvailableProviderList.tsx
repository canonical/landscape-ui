import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Icon } from "@canonical/react-components";
import { IdentityProvider } from "../../types";
import { SUPPORTED_PROVIDERS } from "../../constants";
import {
  GetOidcUrlParams,
  GetUbuntuOneUrlParams,
  useAuthHandle,
} from "../../hooks";
import { redirectToExternalUrl } from "../../helpers";
import classes from "./AvailableProviderList.module.scss";

interface AvailableProviderListProps {
  isUbuntuOneEnabled: boolean;
  oidcProviders: IdentityProvider[];
  onInvitation: (accountTitle: string) => void;
}

const AvailableProviderList: FC<AvailableProviderListProps> = ({
  isUbuntuOneEnabled,
  oidcProviders,
  onInvitation,
}) => {
  const [providerId, setProviderId] = useState(0);
  const [searchParams] = useSearchParams();

  const { getOidcUrlQuery, getUbuntuOneUrlQuery, getInvitationSummaryQuery } =
    useAuthHandle();

  const redirectTo = searchParams.get("redirect-to");
  const invitationId = searchParams.get("invitation_id");
  const external = searchParams.has("external");

  const { data: getInvitationSummaryQueryResult } = getInvitationSummaryQuery(
    { invitationId: invitationId ?? "" },
    { enabled: !!invitationId },
  );

  useEffect(() => {
    if (!getInvitationSummaryQueryResult) {
      return;
    }

    onInvitation(getInvitationSummaryQueryResult.data.account_title);
  }, [getInvitationSummaryQueryResult]);

  const params: GetOidcUrlParams = { id: providerId };

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
    enabled: providerId > 0,
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

  const { data: getUbuntuOneUrlQueryResult } = getUbuntuOneUrlQuery(
    ubuntuOneParams,
    { enabled: providerId === -1 },
  );

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
            onClick={() => setProviderId(-1)}
            className={classes.button}
          >
            <Icon name={SUPPORTED_PROVIDERS["ubuntu-one"].icon} />
            <span>Sign in with Ubuntu One</span>
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
            <span>{`Sign in with ${provider.name}`}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default AvailableProviderList;
