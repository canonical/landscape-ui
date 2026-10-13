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
import { useUnlockUser } from "../../api";
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
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const instanceId = Number(childInstanceId ?? urlInstanceId);
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
        {user && (
          <p className="u-margin--bottom">
            This will restore login access for the user.
          </p>
        )}
        {!user && unlockedCount === 0 && (
          <p className="u-margin--bottom">
            This will restore login access for the users of these accounts.
          </p>
        )}
        {!user && unlockedCount > 0 && (
          <>
            <p className="u-margin--bottom">
              Unlocking these users will restore their login access.
            </p>
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
      </>
    </ConfirmationModal>
  );
};

export default UserUnlockModal;
