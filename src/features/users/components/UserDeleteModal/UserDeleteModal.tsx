import { ConfirmationModal, Input } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { getSelectionLabel, hasOneItem } from "@/utils/_helpers";
import { useRemoveUser } from "../../api";
import { getSelectedUsernames } from "../UserPanelActionButtons/helpers";

interface UserDeleteModalProps {
  readonly close: () => void;
  readonly selectedUsers: User[];
  readonly handleClearSelection?: () => void;
}

const UserDeleteModal: FC<UserDeleteModalProps> = ({
  close,
  selectedUsers,
  handleClearSelection,
}) => {
  const [confirmDeleteHomeFolders, setConfirmDeleteHomeFolders] =
    useState(false);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const instanceId = Number(childInstanceId ?? urlInstanceId);
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { removeUser, isRemovingUser } = useRemoveUser();

  const user = hasOneItem(selectedUsers) ? selectedUsers[0] : undefined;
  const selectedUsersLabel = getSelectionLabel(
    selectedUsers,
    (selectedUser) => selectedUser.username,
    "users",
  );

  const handleRemoveUser = async () => {
    try {
      const { data: activity } = await removeUser({
        computer_ids: [instanceId],
        usernames: getSelectedUsernames(selectedUsers),
        delete_home: confirmDeleteHomeFolders,
      });
      handleClearSelection?.();
      closeSidePanel();
      notify.success({
        title: `You queued ${selectedUsersLabel} to be deleted.`,
        message: `An activity is queued to delete ${selectedUsersLabel}.`,
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(activity);
            },
          },
        ],
      });
      close();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <ConfirmationModal
      title={`Delete ${user ? user.username : "users"}`}
      close={close}
      confirmButtonLabel="Delete"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemovingUser}
      confirmButtonDisabled={isRemovingUser}
      onConfirm={handleRemoveUser}
      renderInPortal
    >
      <div>
        <p className="u-margin--bottom">
          {user
            ? `This will delete user ${user.username}. You can delete this user's home folders at the same time.`
            : "This will delete selected users. You can delete their home folders as well."}
        </p>
        <Input
          label="Delete the home folders as well"
          type="checkbox"
          checked={confirmDeleteHomeFolders}
          onChange={() => {
            setConfirmDeleteHomeFolders((prevState) => !prevState);
          }}
        />
      </div>
    </ConfirmationModal>
  );
};

export default UserDeleteModal;
