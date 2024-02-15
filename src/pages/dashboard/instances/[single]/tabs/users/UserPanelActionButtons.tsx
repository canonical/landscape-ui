import { Button, Icon, Input } from "@canonical/react-components";
import classNames from "classnames";
import { FC, useState } from "react";
import useConfirm from "../../../../../../hooks/useConfirm";
import useDebug from "../../../../../../hooks/useDebug";
import useNotify from "../../../../../../hooks/useNotify";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import useUsers from "../../../../../../hooks/useUsers";
import { User } from "../../../../../../types/User";
import NewUserForm from "../../../NewUserForm";
import {
  getSelectedUsernames,
  getUserLockStatusCounts,
  renderModalBody,
  UserAction,
} from "./_helpers";
import classes from "./UserPanelActionButtons.module.scss";
import { useMediaQuery } from "usehooks-ts";

interface UserPanelActionButtonsProps {
  instanceId: number;
  selectedUsers: User[];
  setSelected?: (items: number[]) => void;
  handleEditUser?: (user: User) => void;
}

const UserPanelActionButtons: FC<UserPanelActionButtonsProps> = ({
  instanceId,
  selectedUsers,
  setSelected,
  handleEditUser,
}) => {
  const [confirmDeleteHomeFolders, setConfirmDeleteHomeFolders] =
    useState(false);
  const user = selectedUsers.length === 1 ? selectedUsers[0] : undefined;
  const { locked: lockedUsersCount, unlocked: unlockedUsersCount } =
    getUserLockStatusCounts(selectedUsers);

  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeUserQuery, lockUserQuery, unlockUserQuery } = useUsers();
  const { mutateAsync: removeUserMutation } = removeUserQuery;
  const { mutateAsync: lockUserMutation } = lockUserQuery;
  const { mutateAsync: unlockUserMutation } = unlockUserQuery;

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
      if (setSelected) {
        setSelected([]);
      }
      closeSidePanel();
      notify.success({ message: `Successfully requested to be ${actionType}` });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
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
    setSidePanelContent(
      "Add new user",
      <NewUserForm instanceId={instanceId} />,
    );
  };

  const handleDeleteUser = async () => {
    confirmModal({
      title: `Delete ${user ? user.username : "users"}`,
      body: (
        <div>
          <p className="u-no-margin--bottom">
            {user
              ? `This will delete user ${user.username}. You can delete this user's home folders at the same time`
              : "This will delete selected users. You can delete their home folders as well"}
          </p>
          <Input
            label="Delete the home folders as well"
            type="checkbox"
            onChange={() =>
              setConfirmDeleteHomeFolders((prevState) => !prevState)
            }
          />
        </div>
      ),
      buttons: [
        <Button key="remove" appearance="negative" onClick={removeUser}>
          Delete
        </Button>,
      ],
    });
  };

  const handleLockUser = async () => {
    confirmModal({
      title: `Lock ${
        user ? `user ${user.username}` : `${selectedUsers.length} users`
      }`,
      body: renderModalBody({
        user: user,
        selectedUsers: selectedUsers,
        userAction: UserAction.Lock,
      }),
      buttons: [
        <Button key="lock" appearance="positive" onClick={lockUser}>
          Lock
        </Button>,
      ],
    });
  };

  const handleUnlockUser = async () => {
    confirmModal({
      title: `Unlock ${
        user ? `user ${user.username}` : `${selectedUsers.length} users`
      }`,
      body: renderModalBody({
        user: user,
        selectedUsers: selectedUsers,
        userAction: UserAction.Unlock,
      }),
      buttons: [
        <Button key="unlock" appearance="positive" onClick={unlockUser}>
          Unlock
        </Button>,
      ],
    });
  };

  return (
    <div
      className={classNames("p-panel__controls", {
        "u-no-margin--left": handleEditUser,
        [classes.cta]: setSelected && isLargeScreen,
      })}
    >
      {setSelected && (
        <Button hasIcon onClick={handleAddUser} className="u-no-margin--right">
          <Icon name="plus" />
          <span>Add user</span>
        </Button>
      )}
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          {(user?.enabled || setSelected) && (
            <Button
              disabled={unlockedUsersCount === 0}
              onClick={handleLockUser}
              className="p-segmented-control__button"
            >
              <Icon name="lock-locked" />
              <span>Lock</span>
            </Button>
          )}
          {(!user?.enabled || setSelected) && (
            <Button
              disabled={lockedUsersCount === 0}
              onClick={handleUnlockUser}
              className="p-segmented-control__button"
            >
              <Icon name="lock-unlock" />
              <span>Unlock</span>
            </Button>
          )}
          {handleEditUser && user && (
            <Button
              onClick={() => handleEditUser(user)}
              className="p-segmented-control__button"
            >
              <Icon name="edit" />
              <span>Edit</span>
            </Button>
          )}
          <Button
            disabled={0 === selectedUsers.length}
            onClick={handleDeleteUser}
            className="p-segmented-control__button"
          >
            <Icon name="delete" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserPanelActionButtons;
