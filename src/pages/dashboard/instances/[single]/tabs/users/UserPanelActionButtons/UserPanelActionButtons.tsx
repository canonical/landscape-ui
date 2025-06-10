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
import useUsers from "@/hooks/useUsers";
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

const EditUserForm = lazy(
  async () =>
    import("@/pages/dashboard/instances/[single]/tabs/users/EditUserForm"),
);

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
  const { removeUserQuery, lockUserQuery, unlockUserQuery } = useUsers();
  const [lockOpen, setLockOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

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
          collapseFrom="lg"
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
          confirmButtonLoading={isLocking}
          confirmButtonDisabled={isLocking}
          onConfirm={lockUser}
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
          confirmButtonLoading={isUnlocking}
          confirmButtonDisabled={isUnlocking}
          onConfirm={unlockUser}
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
          confirmButtonLoading={isRemoving}
          confirmButtonDisabled={isRemoving}
          onConfirm={removeUser}
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
