import type { FC } from "react";
import { EMPTY_STATE_NO_ISSUERS } from "@/pages/dashboard/settings/employees/tabs/employee-groups/constants";
import { Button, Icon, ICONS } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import { useNavigate } from "react-router";
import { ROUTES } from "@/libs/routes";

const EmptyStateNoIssuers: FC = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      title={EMPTY_STATE_NO_ISSUERS.title}
      body={EMPTY_STATE_NO_ISSUERS.body}
      cta={[
        <Button
          key="import-employee-groups"
          appearance="positive"
          className="p-segmented-control__button"
          hasIcon
          onClick={async () => navigate(ROUTES.settingsIdentityProviders())}
        >
          <Icon name={ICONS.plus} light />
          <span>Add identity provider</span>
        </Button>,
      ]}
    />
  );
};

export default EmptyStateNoIssuers;
