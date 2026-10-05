import type { FC } from "react";
import { Link } from "react-router";
import { ROUTES } from "@/libs/routes";

interface AccountCreationAlternativeProps {
  readonly oidcEnabled: boolean;
  readonly ubuntuOneEnabled: boolean;
}

const AccountCreationAlternative: FC<AccountCreationAlternativeProps> = ({
  oidcEnabled,
  ubuntuOneEnabled,
}) => {
  if (!oidcEnabled && !ubuntuOneEnabled) {
    return null;
  }

  let providerLabel = "Ubuntu One";
  if (oidcEnabled && ubuntuOneEnabled) {
    providerLabel = "Ubuntu One or OIDC";
  } else if (oidcEnabled) {
    providerLabel = "OIDC";
  }

  return (
    <p className="p-text--small u-text--center u-margin--bottom">
      <Link
        className="p-link"
        to={ROUTES.auth.login()}
        state={{ allowFederatedLogin: true }}
      >
        {`Sign in with ${providerLabel} instead`}
      </Link>
    </p>
  );
};

export default AccountCreationAlternative;
