import {
  Button,
  ConfirmationModal,
  Icon,
  ICONS,
  Input,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { User } from "@/types/User";
import NewUserForm from "../NewUserForm";
import {
  getSelectedUsernames,
  getUserLockStatusCounts,
  renderModalBody,
  UserAction,
} from "./helpers";
import LoadingState from "@/components/layout/LoadingState";
import { useParams } from "react-router";
import type { UrlParams } from "@/types/UrlParams";
import { ResponsiveButtons } from "@/components/ui";
import { useLockUser, useRemoveUser, useUnlockUser } from "../../api";

const EditUserForm = lazy(async () => import("../EditUserForm"));

interface UserPanelActionButtonsProps {
  readonly selectedUsers: User[];
  readonly handleClearSelection?: () => void;
  readonly sidePanel?: boolean;
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
  const { removeUser, isRemovingUser } = useRemoveUser();
  const { lockUser, isLockingUser } = useLockUser();
  const { unlockUser, isUnlockingUser } = useUnlockUser();
  const [lockOpen, setLockOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const instanceId = Number(urlInstanceId);
  const user = selectedUsers.length === 1 ? selectedUsers[0] : undefined;

  const { locked: lockedUsersCount, unlocked: unlockedUsersCount } =
    getUserLockStatusCounts(selectedUsers);

  const performUserAction = async (
    mutation: typeof removeUser | typeof lockUser | typeof unlockUser,
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

  const handleLockUser = async () => {
    await performUserAction(lockUser, "locked");
  };

  const handleUnlockUser = async () => {
    await performUserAction(unlockUser, "unlocked");
  };

  const handleRemoveUser = async () => {
    await performUserAction(removeUser, "removed");
  };

  const handleAddUser = () => {
    setSidePanelContent("Add new user", <NewUserForm />);
  };

  const handleEditUser = (currentUser: User) => {
    setSidePanelContent(
      "Edit user",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm user={currentUser} />
      </Suspense>,
    );
  };

  const handleToggleDeleteUserHomeFolders = () => {
    setConfirmDeleteHomeFolders((prevState) => !prevState);
  };

  return (
    <>
      <div
        className={classNames("p-panel__controls u-no-padding--top", {
          "u-no-margin--left": sidePanel,
        })}
      >
        {!sidePanel && (
          <Button
            className={classNames("u-no-margin--right", {
              "u-no-margin--bottom": !sidePanel,
            })}
            type="button"
            hasIcon
            onClick={handleAddUser}
          >
            <Icon name={ICONS.plus} />
            <span>Add user</span>
          </Button>
        )}
        <ResponsiveButtons
          collapseFrom={!sidePanel ? "lg" : undefined}
          buttons={[
            (user?.enabled || !sidePanel) && (
              <Button
                key="lock"
                hasIcon
                type="button"
                disabled={unlockedUsersCount === 0}
                onClick={() => {
                  setLockOpen(true);
                }}
              >
                <Icon name="lock-locked" />
                <span>Lock</span>
              </Button>
            ),
            (!user?.enabled || !sidePanel) && (
              <Button
                key="unlock"
                hasIcon
                type="button"
                disabled={lockedUsersCount === 0}
                onClick={() => {
                  setUnlockOpen(true);
                }}
              >
                <Icon name="lock-unlock" />
                <span>Unlock</span>
              </Button>
            ),
            sidePanel && user && (
              <Button
                key="edit"
                className={classNames("p-segmented-control__button has-icon", {
                  "u-no-margin--bottom": !sidePanel,
                })}
                type="button"
                onClick={() => {
                  handleEditUser(user);
                }}
              >
                <Icon name="edit" />
                <span>Edit</span>
              </Button>
            ),
            <Button
              key="delete"
              hasIcon
              type="button"
              disabled={0 === selectedUsers.length}
              onClick={() => {
                setRemoveOpen(true);
              }}
            >
              <Icon name={ICONS.delete} />
              <span>Delete</span>
            </Button>,
          ]}
        />
      </div>
      {lockOpen && (
        <ConfirmationModal
          title={`Lock ${
            user ? `user ${user.username}` : `${selectedUsers.length} users`
          }`}
          close={() => {
            setLockOpen(false);
          }}
          confirmButtonLabel="Lock"
          confirmButtonAppearance="positive"
          confirmButtonLoading={isLockingUser}
          confirmButtonDisabled={isLockingUser}
          onConfirm={handleLockUser}
        >
          {renderModalBody({
            user: user,
            selectedUsers: selectedUsers,
            userAction: UserAction.Lock,
          })}
        </ConfirmationModal>
      )}
      {unlockOpen && (
        <ConfirmationModal
          title={`Unlock ${
            user ? `user ${user.username}` : `${selectedUsers.length} users`
          }`}
          close={() => {
            setUnlockOpen(false);
          }}
          confirmButtonLabel="Unlock"
          confirmButtonAppearance="positive"
          confirmButtonLoading={isUnlockingUser}
          confirmButtonDisabled={isUnlockingUser}
          onConfirm={handleUnlockUser}
        >
          {renderModalBody({
            user: user,
            selectedUsers: selectedUsers,
            userAction: UserAction.Unlock,
          })}
        </ConfirmationModal>
      )}
      {removeOpen && (
        <ConfirmationModal
          title={`Delete ${user ? user.username : "users"}`}
          close={() => {
            setRemoveOpen(false);
          }}
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonLoading={isRemovingUser}
          confirmButtonDisabled={isRemovingUser}
          onConfirm={handleRemoveUser}
        >
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
        </ConfirmationModal>
      )}
    </>
  );
};

export default UserPanelActionButtons;
