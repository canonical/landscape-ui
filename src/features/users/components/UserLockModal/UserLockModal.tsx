import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useParams } from "react-router";
import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount/PluralizeWithBoldCount";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getSelectionLabel, hasOneItem } from "@/utils/_helpers";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { useLockUser } from "../../api";
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
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const instanceId = Number(childInstanceId ?? urlInstanceId);
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
          <p className="u-margin--bottom">
            This will prevent this user from logging into this account without
            deleting the files belonging to the account.
          </p>
        )}
        {!user && lockedCount === 0 && (
          <p className="u-margin--bottom">
            This will prevent users from logging into these accounts without
            deleting the files belonging to the accounts.
          </p>
        )}
        {!user && lockedCount > 0 && (
          <>
            <p className="u-margin--bottom">
              Locking these users will remove their login access.
            </p>
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
      </>
    </ConfirmationModal>
  );
};

export default UserLockModal;
