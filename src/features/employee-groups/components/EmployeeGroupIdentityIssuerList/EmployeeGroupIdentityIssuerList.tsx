import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import classes from "./EmployeeGroupIdentityIssuerList.module.scss";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import type { OidcIssuer } from "@/features/oidc";
import { useOidcIssuers } from "@/features/oidc";
import { getProviderIcon } from "@/features/auth";
import EmptyState from "@/components/layout/EmptyState";
import { useNavigate } from "react-router";

const ImportEmployeeGroupsForm = lazy(
  () => import("../ImportEmployeeGroupsForm"),
);

const EmployeeGroupIdentityIssuerList: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { oidcDirectoryIssuers } = useOidcIssuers();
  const navigate = useNavigate();

  const handleSelectProviderSource = (issuer: OidcIssuer) => {
    setSidePanelContent(
      `Import employee groups from ${issuer.provider.provider_label}`,
      <Suspense fallback={<LoadingState />}>
        <ImportEmployeeGroupsForm issuer={issuer} />
      </Suspense>,
    );
  };

  if (!oidcDirectoryIssuers.length) {
    return (
      <EmptyState
        title="You Need to Set Up a Supported Identity Provider"
        body="To import Employee Groups, you must set up a supported Identity
          Provider with a service account that authenticates using short-lived
          credentials or a signed JWT for access tokens."
        cta={[
          <Button
            key="import-employee-groups"
            appearance="positive"
            className="p-segmented-control__button"
            onClick={() => navigate("/settings/identity-providers")}
          >
            <span>Go to Identity Providers</span>
          </Button>,
        ]}
      />
    );
  }

  return (
    <ul className="u-no-margin--left u-no-margin--bottom u-no-margin--right u-no-padding--left u-no-padding--right p-list">
      {oidcDirectoryIssuers.map((issuer) => (
        <li key={issuer.id} className="p-list__item u-no-padding--top">
          <Button
            type="button"
            appearance="base"
            hasIcon
            onClick={() => handleSelectProviderSource(issuer)}
            className={classes.providerButton}
          >
            <span className={classes.iconContainer}>
              <Icon
                name={getProviderIcon(issuer.provider.provider_slug)}
                className={classes.icon}
              />
              <span className="u-align-text--left">
                <span className={classes.name}>
                  {issuer.provider.provider_label}
                </span>
                <span className={classes.url}>{issuer.url}</span>
              </span>
            </span>
            <Icon name="chevron-down" className={classes.arrow} />
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default EmployeeGroupIdentityIssuerList;
