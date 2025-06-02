import type { FC } from "react";
import { EMPTY_STATE_NO_GROUPS } from "@/pages/dashboard/settings/employees/tabs/employee-groups/constants";
import { Button, Icon, ICONS } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";

interface EmptyStateNoGroupsProps {
  readonly handleImportEmployeeGroups: () => void;
}

const EmptyStateNoGroups: FC<EmptyStateNoGroupsProps> = ({
  handleImportEmployeeGroups,
}) => (
  <EmptyState
    title={EMPTY_STATE_NO_GROUPS.title}
    body={EMPTY_STATE_NO_GROUPS.body}
    cta={[
      <Button
        key="import-employee-groups"
        appearance="positive"
        className="p-segmented-control__button"
        hasIcon
        onClick={handleImportEmployeeGroups}
      >
        <Icon name={ICONS.plus} light />
        <span>Import employee groups.</span>
      </Button>,
    ]}
  />
);

export default EmptyStateNoGroups;
