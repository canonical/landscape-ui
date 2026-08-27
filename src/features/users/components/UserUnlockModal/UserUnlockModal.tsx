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
import { useUnlockUser } from "../../api";
import { getPendingUserActivityMessage } from "../../constants";
import {
  getSelectedUsernames,
  getUserLockStatusCounts,
} from "../UserPanelActionButtons/helpers";

interface UserUnlockModalProps {
  readonly close: () => void;
  readonly selectedUsers: User[];
  readonly handleClearSelection?: () => void;
}

const UserUnlockModal: FC<UserUnlockModalProps> = ({
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
  const { unlockUser, isUnlockingUser } = useUnlockUser();

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

  const handleUnlockUser = async () => {
    try {
      const { data: activity } = await unlockUser({
        computer_ids: [instanceId],
        usernames: getSelectedUsernames(selectedUsers),
      });
      handleClearSelection?.();
      closeSidePanel();
      notify.success({
        title: `You queued ${selectedUsersLabel} to be unlocked.`,
        message: `An activity is queued to unlock ${selectedUsersLabel}.`,
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
      title={`Unlock ${
        user ? `user ${user.username}` : `${selectedUsers.length} users`
      }`}
      close={close}
      confirmButtonLabel="Unlock"
      confirmButtonAppearance="positive"
      confirmButtonLoading={isUnlockingUser}
      confirmButtonDisabled={isUnlockingUser}
      onConfirm={handleUnlockUser}
      renderInPortal
    >
      <>
        {user && <p>This will restore login access for the user.</p>}
        {!user && unlockedCount === 0 && (
          <p>This will restore login access for the users of these accounts.</p>
        )}
        {!user && unlockedCount > 0 && (
          <>
            <p>Unlocking users removes their login access.</p>
            You selected{" "}
            <PluralizeWithBoldCount
              count={selectedUsers.length}
              singular="user"
            />
            . This will:
            <ul>
              <li>
                unlock{" "}
                <PluralizeWithBoldCount count={lockedCount} singular="user" />
              </li>
              <li>
                leave{" "}
                <PluralizeWithBoldCount count={unlockedCount} singular="user" />{" "}
                unlocked
              </li>
            </ul>
          </>
        )}
        {renderPendingNotice()}
      </>
    </ConfirmationModal>
  );
};

export default UserUnlockModal;
