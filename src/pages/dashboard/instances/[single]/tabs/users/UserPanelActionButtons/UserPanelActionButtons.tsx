import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
  Input,
} from "@canonical/react-components";
import classNames from "classnames";
import { FC, Suspense, lazy, useState } from "react";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import useUsers from "@/hooks/useUsers";
import { User } from "@/types/User";
import NewUserForm from "../NewUserForm";
import {
  UserAction,
  getSelectedUsernames,
  getUserLockStatusCounts,
  renderModalBody,
} from "./helpers";
import LoadingState from "@/components/layout/LoadingState";
import { useParams } from "react-router";
import { UrlParams } from "@/types/UrlParams";

const EditUserForm = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users/EditUserForm"),
);

interface UserPanelActionButtonsProps {
  selectedUsers: User[];
  handleClearSelection?: () => void;
  sidePanel?: boolean;
}

const UserPanelActionButtons: FC<UserPanelActionButtonsProps> = ({
  selectedUsers,
  handleClearSelection,
  sidePanel = false,
}) => {
  const [confirmDeleteHomeFolders, setConfirmDeleteHomeFolders] =
    useState(false);

  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { removeUserQuery, lockUserQuery, unlockUserQuery } = useUsers();

  const { mutateAsync: removeUserMutation, isPending: isRemoving } =
    removeUserQuery;
  const { mutateAsync: lockUserMutation, isPending: isLocking } = lockUserQuery;
  const { mutateAsync: unlockUserMutation, isPending: isUnlocking } =
    unlockUserQuery;

  const instanceId = Number(urlInstanceId);
  const user = selectedUsers.length === 1 ? selectedUsers[0] : undefined;

  const { locked: lockedUsersCount, unlocked: unlockedUsersCount } =
    getUserLockStatusCounts(selectedUsers);

  const performUserAction = async (
    mutation:
      | typeof removeUserMutation
      | typeof lockUserMutation
      | typeof unlockUserMutation,
    actionType: string,
  ) => {
    try {
      await mutation({
        computer_ids: [instanceId],
        usernames: getSelectedUsernames(selectedUsers),
        delete_home:
          actionType === "removed" ? confirmDeleteHomeFolders : undefined,
      });
      if (handleClearSelection) {
        handleClearSelection();
      }
      closeSidePanel();
      notify.success({ message: `Successfully requested to be ${actionType}` });
    } catch (error) {
      debug(error);
    }
  };

  const lockUser = async () => {
    await performUserAction(lockUserMutation, "locked");
  };

  const unlockUser = async () => {
    await performUserAction(unlockUserMutation, "unlocked");
  };

  const removeUser = async () => {
    await performUserAction(removeUserMutation, "removed");
  };

  const handleAddUser = () => {
    setSidePanelContent("Add new user", <NewUserForm />);
  };

  const handleEditUser = (user: User) => {
    setSidePanelContent(
      "Edit user",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm user={user} />
      </Suspense>,
    );
  };

  const handleToggleDeleteUserHomeFolders = () => {
    setConfirmDeleteHomeFolders((prevState) => !prevState);
  };

  return (
    <div
      className={classNames("p-panel__controls u-no-padding--top", {
        "u-no-margin--left": sidePanel,
      })}
    >
      {!sidePanel && (
        <Button
          className="u-no-margin--right"
          type="button"
          hasIcon
          onClick={handleAddUser}
        >
          <Icon name={ICONS.plus} />
          <span>Add user</span>
        </Button>
      )}
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          {(user?.enabled || !sidePanel) && (
            <ConfirmationButton
              className="p-segmented-control__button has-icon"
              type="button"
              disabled={unlockedUsersCount === 0}
              aria-disabled={unlockedUsersCount === 0}
              confirmationModalProps={{
                title: `Lock ${
                  user
                    ? `user ${user.username}`
                    : `${selectedUsers.length} users`
                }`,
                children: renderModalBody({
                  user: user,
                  selectedUsers: selectedUsers,
                  userAction: UserAction.Lock,
                }),
                confirmButtonLabel: "Lock",
                confirmButtonAppearance: "positive",
                confirmButtonLoading: isLocking,
                confirmButtonDisabled: isLocking,
                onConfirm: lockUser,
              }}
            >
              <Icon name="lock-locked" />
              <span>Lock</span>
            </ConfirmationButton>
          )}
          {(!user?.enabled || !sidePanel) && (
            <ConfirmationButton
              className="p-segmented-control__button has-icon"
              type="button"
              disabled={lockedUsersCount === 0}
              aria-disabled={lockedUsersCount === 0}
              confirmationModalProps={{
                title: `Unlock ${
                  user
                    ? `user ${user.username}`
                    : `${selectedUsers.length} users`
                }`,
                children: renderModalBody({
                  user: user,
                  selectedUsers: selectedUsers,
                  userAction: UserAction.Unlock,
                }),
                confirmButtonLabel: "Unlock",
                confirmButtonAppearance: "positive",
                confirmButtonLoading: isUnlocking,
                confirmButtonDisabled: isUnlocking,
                onConfirm: unlockUser,
              }}
            >
              <Icon name="lock-unlock" />
              <span>Unlock</span>
            </ConfirmationButton>
          )}
          {sidePanel && user && (
            <Button
              className="p-segmented-control__button"
              type="button"
              onClick={() => handleEditUser(user)}
            >
              <Icon name="edit" />
              <span>Edit</span>
            </Button>
          )}

          <ConfirmationButton
            className="p-segmented-control__button has-icon"
            type="button"
            disabled={0 === selectedUsers.length}
            aria-disabled={0 === selectedUsers.length}
            confirmationModalProps={{
              title: `Delete ${user ? user.username : "users"}`,
              children: (
                <div>
                  <p className="u-no-margin--bottom">
                    {user
                      ? `This will delete user ${user.username}. You can delete this user's home folders at the same time.`
                      : "This will delete selected users. You can delete their home folders as well."}
                  </p>
                  <Input
                    label="Delete the home folders as well"
                    type="checkbox"
                    checked={confirmDeleteHomeFolders}
                    onChange={handleToggleDeleteUserHomeFolders}
                  />
                </div>
              ),
              confirmButtonLabel: "Delete",
              confirmButtonAppearance: "negative",
              confirmButtonLoading: isRemoving,
              confirmButtonDisabled: isRemoving,
              onConfirm: removeUser,
            }}
          >
            <Icon name={ICONS.delete} />
            <span>Delete</span>
          </ConfirmationButton>
        </div>
      </div>
    </div>
  );
};

export default UserPanelActionButtons;
