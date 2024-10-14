import { FC, lazy, Suspense } from "react";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
  Tooltip,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
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
  const { removeRoleQuery } = useRoles();

  const { mutateAsync: removeRole, isPending: isRemoving } = removeRoleQuery;

  const handleRemoveRole = async (roleName: string) => {
    try {
      await removeRole({ name: roleName });
    } catch (error) {
      debug(error);
    }
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
        <ConfirmationButton
          className="u-no-margin--bottom u-no-padding--left is-small has-icon"
          type="button"
          appearance="base"
          aria-label={`Delete ${role.name} role`}
          confirmationModalProps={{
            title: `Remove '${role.name}' role`,
            children: (
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
            confirmButtonLabel: "Remove",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled: isRemoving,
            confirmButtonLoading: isRemoving,
            onConfirm: () => handleRemoveRole(role.name),
          }}
        >
          <Tooltip position="top-center" message="Delete">
            <Icon name={ICONS.delete} />
          </Tooltip>
        </ConfirmationButton>
      </div>
    </div>
  );
};

export default RoleListActions;
