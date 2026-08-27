import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import useSidePanel from "@/hooks/useSidePanel";
import type { User } from "@/types/User";
import { hasOneItem } from "@/utils/_helpers";
import NewUserForm from "../NewUserForm";
import { getUserLockStatusCounts } from "./helpers";
import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import UserLockModal from "../UserLockModal";
import UserUnlockModal from "../UserUnlockModal";
import UserDeleteModal from "../UserDeleteModal";

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
  const { setSidePanelContent } = useSidePanel();
  const {
    value: isLockOpen,
    setTrue: openLockModal,
    setFalse: closeLockModal,
  } = useBoolean();
  const {
    value: isUnlockOpen,
    setTrue: openUnlockModal,
    setFalse: closeUnlockModal,
  } = useBoolean();
  const {
    value: isRemoveOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const user = hasOneItem(selectedUsers) ? selectedUsers[0] : undefined;

  const { locked: lockedUsersCount, unlocked: unlockedUsersCount } =
    getUserLockStatusCounts(selectedUsers);

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
                onClick={openLockModal}
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
                onClick={openUnlockModal}
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
              onClick={openRemoveModal}
            >
              <Icon
                name={sidePanel ? `${ICONS.delete}--negative` : ICONS.delete}
              />
              <span className={sidePanel ? "u-text--negative" : undefined}>
                Delete
              </span>
            </Button>,
          ]}
        />
      </div>
      {isLockOpen && (
        <UserLockModal
          close={closeLockModal}
          selectedUsers={selectedUsers}
          handleClearSelection={handleClearSelection}
        />
      )}
      {isUnlockOpen && (
        <UserUnlockModal
          close={closeUnlockModal}
          selectedUsers={selectedUsers}
          handleClearSelection={handleClearSelection}
        />
      )}
      {isRemoveOpen && (
        <UserDeleteModal
          close={closeRemoveModal}
          selectedUsers={selectedUsers}
          handleClearSelection={handleClearSelection}
        />
      )}
    </>
  );
};

export default UserPanelActionButtons;
