import { Button } from "@canonical/react-components";
import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { useOidcIssuers } from "@/features/oidc";
import EmptyState from "@/components/layout/EmptyState";
import { useNavigate } from "react-router";
import EmployeeGroupIdentityIssuerList from "../EmployeeGroupIdentityIssuerList";
import { EMPTY_STATE } from "./constants";

const EmployeeGroupIdentityIssuerListContainer: FC = () => {
  const { oidcDirectoryIssuers, isOidcIssuersLoading } = useOidcIssuers();
  const navigate = useNavigate();

  if (isOidcIssuersLoading) {
    return <LoadingState />;
  }

  if (!oidcDirectoryIssuers.length) {
    return (
      <EmptyState
        title={EMPTY_STATE.title}
        body={EMPTY_STATE.body}
        cta={[
          <Button
            key="import-employee-groups"
            appearance="positive"
            className="p-segmented-control__button"
            onClick={async () => navigate("/settings/identity-providers")}
          >
            <span>Go to identity providers</span>
          </Button>,
        ]}
      />
    );
  }

  return <EmployeeGroupIdentityIssuerList issuers={oidcDirectoryIssuers} />;
};

export default EmployeeGroupIdentityIssuerListContainer;
