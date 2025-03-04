import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import classes from "./EmployeeGroupIdentityIssuerList.module.scss";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import type { OidcIssuer } from "@/features/oidc";
import { getProviderIcon } from "@/features/auth";

const ImportEmployeeGroupsForm = lazy(
  () => import("../ImportEmployeeGroupsForm"),
);

interface EmployeeGroupIdentityIssuerListProps {
  readonly issuers: OidcIssuer[];
}

const EmployeeGroupIdentityIssuerList: FC<
  EmployeeGroupIdentityIssuerListProps
> = ({ issuers }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleSelectProviderSource = (issuer: OidcIssuer) => {
    setSidePanelContent(
      `Import employee groups from ${issuer.provider.provider_label}`,
      <Suspense fallback={<LoadingState />}>
        <ImportEmployeeGroupsForm issuer={issuer} />
      </Suspense>,
    );
  };

  return (
    <ul className="u-no-margin--left u-no-margin--bottom u-no-margin--right u-no-padding--left u-no-padding--right p-list">
      {issuers.map((issuer) => (
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
