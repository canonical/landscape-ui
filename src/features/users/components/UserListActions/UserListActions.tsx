import ListActions from "@/components/layout/ListActions";
import type { User } from "@/types/User";
import { ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import UserDeleteModal from "../UserDeleteModal";
import UserLockModal from "../UserLockModal";
import UserUnlockModal from "../UserUnlockModal";

interface UserListActionsProps {
  readonly user: User;
  readonly onEdit: () => void;
}

const UserListActions: FC<UserListActionsProps> = ({ user, onEdit }) => {
  const {
    value: isLockModalOpen,
    setTrue: openLockModal,
    setFalse: closeLockModal,
  } = useBoolean();
  const {
    value: isUnlockModalOpen,
    setTrue: openUnlockModal,
    setFalse: closeUnlockModal,
  } = useBoolean();
  const {
    value: isDeleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean();

  const userLabel = user.name || user.username;
  const accessAction = user.enabled
    ? {
        icon: "lock-locked",
        label: "Lock",
        "aria-label": `Lock "${userLabel}" user`,
        onClick: openLockModal,
      }
    : {
        icon: "lock-unlock",
        label: "Unlock",
        "aria-label": `Unlock "${userLabel}" user`,
        onClick: openUnlockModal,
      };

  return (
    <>
      <ListActions
        toggleAriaLabel={`"${userLabel}" user actions`}
        actions={[
          {
            icon: "edit",
            label: "Edit",
            "aria-label": `Edit "${userLabel}" user`,
            onClick: onEdit,
          },
          accessAction,
        ]}
        destructiveActions={[
          {
            icon: ICONS.delete,
            label: "Delete",
            "aria-label": `Delete "${userLabel}" user`,
            onClick: openDeleteModal,
            appearance: "negative",
          },
        ]}
      />

      {isLockModalOpen && (
        <UserLockModal close={closeLockModal} selectedUsers={[user]} />
      )}
      {isUnlockModalOpen && (
        <UserUnlockModal close={closeUnlockModal} selectedUsers={[user]} />
      )}
      {isDeleteModalOpen && (
        <UserDeleteModal close={closeDeleteModal} selectedUsers={[user]} />
      )}
    </>
  );
};

export default UserListActions;