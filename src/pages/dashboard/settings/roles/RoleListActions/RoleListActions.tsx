import { FC, lazy, Suspense } from "react";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { Role } from "@/types/Role";
import classes from "./RoleListActions.module.scss";

const EditRoleForm = lazy(
  () => import("@/pages/dashboard/settings/roles/EditRoleForm"),
);

interface RoleListActionsProps {
  role: Role;
}

const RoleListActions: FC<RoleListActionsProps> = ({ role }) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removeRoleQuery } = useRoles();

  const { mutateAsync: removeRole, isLoading: removeRoleLoading } =
    removeRoleQuery;

  const handleRemoveRole = async (name: string) => {
    try {
      await removeRole({ name });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveRoleDialog = (role: Role) => {
    confirmModal({
      title: `Remove '${role.name}' role`,
      body: (
        <p>
          <span>{`This will remove '${role.name}' role.`}</span>
          {role.persons.length > 0 && (
            <>
              <br />
              <span className={classes.bold}>
                {`This will affect ${role.persons.length} administrator${role.persons.length === 1 ? "" : "s"}`}
              </span>
            </>
          )}
        </p>
      ),
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemoveRole(role.name)}
          disabled={removeRoleLoading}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handleEditRole = (role: Role) => {
    setSidePanelContent(
      `Edit "${role.name}" role`,
      <Suspense fallback={<LoadingState />}>
        <EditRoleForm role={role} />
      </Suspense>,
    );
  };

  return (
    <div className="divided-blocks">
      <div className="divided-blocks__item">
        <Tooltip message="Edit" position="top-center">
          <Button
            small
            hasIcon
            type="button"
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left"
            aria-label={`Edit ${role.name} role`}
            onClick={() => handleEditRole(role)}
          >
            <Icon name="edit" className="u-no-margin--left" />
          </Button>
        </Tooltip>
      </div>
      <div className="divided-blocks__item">
        <Tooltip message="Delete" position="top-center">
          <Button
            small
            hasIcon
            type="button"
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left"
            aria-label={`Delete ${role.name} role`}
            onClick={() => handleRemoveRoleDialog(role)}
          >
            <Icon name="delete" className="u-no-margin--left" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default RoleListActions;
