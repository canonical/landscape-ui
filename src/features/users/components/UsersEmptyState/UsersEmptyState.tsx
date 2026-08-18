import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import {
  ADD_USER_LABEL,
  EMPTY_STATE_BODY,
  EMPTY_STATE_TITLE,
} from "./constants";

interface UsersEmptyStateProps {
  readonly onAddUser: () => void;
}

const UsersEmptyState: FC<UsersEmptyStateProps> = ({ onAddUser }) => {
  return (
    <EmptyState
      title={EMPTY_STATE_TITLE}
      body={EMPTY_STATE_BODY}
      icon="connected"
      cta={[
        <Button
          type="button"
          key="empty-state-add-new-user"
          appearance="positive"
          onClick={onAddUser}
        >
          {ADD_USER_LABEL}
        </Button>,
      ]}
    />
  );
};

export default UsersEmptyState;
