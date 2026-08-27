import { ConfirmationModal, Input } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { getSelectionLabel, hasOneItem, pluralize } from "@/utils/_helpers";
import { useRemoveUser } from "../../api";
import { getPendingUserActivityMessage } from "../../constants";
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

  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const instanceId = Number(urlInstanceId);
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
  const usersWithPendingActivity = selectedUsers.filter((selectedUser) =>
    Boolean(selectedUser.pending_activity),
  );

  const renderPendingNotice = () => {
    if (user?.pending_activity) {
      const { operation, activity_id, summary } = user.pending_activity;
      return (
        <p>
          {getPendingUserActivityMessage(operation)}{" "}
          <Link
            to={ROUTES.activities.root({ query: `id:${activity_id}` })}
            state={{ activity: { id: activity_id, summary } }}
            onClick={() => {
              close();
              closeSidePanel();
            }}
          >
            View activity
          </Link>
          . If you proceed, a new activity will be queued for this user.
        </p>
      );
    }

    if (usersWithPendingActivity.length > 0) {
      const activityQuery = usersWithPendingActivity
        .map(
          (selectedUser) => `id:${selectedUser.pending_activity?.activity_id}`,
        )
        .join(" OR ");
      return (
        <p>
          {pluralize(
            usersWithPendingActivity.length,
            ["user has", "users have"],
            "exact",
          )}{" "}
          <Link to={ROUTES.activities.root({ query: activityQuery })}>
            {pluralize(usersWithPendingActivity.length, [
              "a pending activity",
              "pending activities",
            ])}
          </Link>
          . If you proceed, a new activity will be queued for each selected
          user.
        </p>
      );
    }

    return null;
  };

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
        <p className="u-no-margin--bottom">
          {user
            ? `This will delete user ${user.username}. You can delete this user's home folders at the same time.`
            : "This will delete selected users. You can delete their home folders as well."}
        </p>
        {renderPendingNotice()}
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
