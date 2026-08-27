import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { Link, useParams } from "react-router";
import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount/PluralizeWithBoldCount";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import { getSelectionLabel, hasOneItem, pluralize } from "@/utils/_helpers";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { useLockUser } from "../../api";
import { getPendingUserActivityMessage } from "../../constants";
import {
  getSelectedUsernames,
  getUserLockStatusCounts,
} from "../UserPanelActionButtons/helpers";

interface UserLockModalProps {
  readonly close: () => void;
  readonly selectedUsers: User[];
  readonly handleClearSelection?: () => void;
}

const UserLockModal: FC<UserLockModalProps> = ({
  close,
  selectedUsers,
  handleClearSelection,
}) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const instanceId = Number(urlInstanceId);
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { lockUser, isLockingUser } = useLockUser();

  const user = hasOneItem(selectedUsers) ? selectedUsers[0] : undefined;
  const selectedUsersLabel = getSelectionLabel(
    selectedUsers,
    (selectedUser) => selectedUser.username,
    "users",
  );
  const { locked: lockedCount, unlocked: unlockedCount } =
    getUserLockStatusCounts(selectedUsers);
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

  const handleLockUser = async () => {
    try {
      const { data: activity } = await lockUser({
        computer_ids: [instanceId],
        usernames: getSelectedUsernames(selectedUsers),
      });
      handleClearSelection?.();
      closeSidePanel();
      notify.success({
        title: `You queued ${selectedUsersLabel} to be locked.`,
        message: `An activity is queued to lock ${selectedUsersLabel}.`,
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
      title={`Lock ${
        user ? `user ${user.username}` : `${selectedUsers.length} users`
      }`}
      close={close}
      confirmButtonLabel="Lock"
      confirmButtonAppearance="positive"
      confirmButtonLoading={isLockingUser}
      confirmButtonDisabled={isLockingUser}
      onConfirm={handleLockUser}
      renderInPortal
    >
      <>
        {user && (
          <p>
            This will prevent this user from logging into this account without
            deleting the files belonging to the account.
          </p>
        )}
        {!user && lockedCount === 0 && (
          <p>
            This will prevent users from logging into these accounts without
            deleting the files belonging to the accounts.
          </p>
        )}
        {!user && lockedCount > 0 && (
          <>
            <p>Locking users removes their login access.</p>
            You selected{" "}
            <PluralizeWithBoldCount
              count={selectedUsers.length}
              singular="user"
            />
            . This will:
            <ul>
              <li>
                lock{" "}
                <PluralizeWithBoldCount count={unlockedCount} singular="user" />
              </li>
              <li>
                leave{" "}
                <PluralizeWithBoldCount count={lockedCount} singular="user" />{" "}
                locked
              </li>
            </ul>
          </>
        )}
        {renderPendingNotice()}
      </>
    </ConfirmationModal>
  );
};

export default UserLockModal;
