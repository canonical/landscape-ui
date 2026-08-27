import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

interface UsersEmptyStateProps {
  readonly onAddUser: () => void;
}

const UsersEmptyState: FC<UsersEmptyStateProps> = ({ onAddUser }) => {
  return (
    <EmptyState
      title="No users found"
      body="Add new users by clicking the button below."
      icon="connected"
      cta={[
        <Button
          type="button"
          key="empty-state-add-new-user"
          appearance="positive"
          onClick={onAddUser}
        >
          Add user
        </Button>,
      ]}
    />
  );
};

export default UsersEmptyState;
