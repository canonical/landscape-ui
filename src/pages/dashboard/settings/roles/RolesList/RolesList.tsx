import { FC, lazy, Suspense, useMemo } from "react";
import { Role } from "@/types/Role";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import useConfirm from "@/hooks/useConfirm";
import useRoles from "@/hooks/useRoles";
import classes from "@/pages/dashboard/settings/roles/RolesContainer/RolesContainer.module.scss";
import { Button, Icon, ModularTable } from "@canonical/react-components";
import { CellProps, Column } from "react-table";
import OverflowingCell from "@/components/layout/OverflowingCell";
import { getPermissionLabelsByType } from "./helpers";
import { getPermissionOptions } from "@/pages/dashboard/settings/roles/helpers";
import LoadingState from "@/components/layout/LoadingState";

const EditRoleForm = lazy(
  () => import("@/pages/dashboard/settings/roles/EditRoleForm"),
);

interface RolesListProps {
  roleList: Role[];
}

const RolesList: FC<RolesListProps> = ({ roleList }) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { getPermissionsQuery, removeRoleQuery } = useRoles();

  const { data: getPermissionsQueryResult } = getPermissionsQuery();

  const permissionOptions = getPermissionsQueryResult
    ? getPermissionOptions(getPermissionsQueryResult.data)
    : [];

  const roles = useMemo<Role[]>(() => roleList, [roleList]);

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
      "Edit role",
      <Suspense fallback={<LoadingState />}>
        <EditRoleForm role={role} />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<Role>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "persons",
        Header: "Administrators",
        Cell: ({ row }: CellProps<Role>) => row.original.persons.length,
      },
      {
        accessor: "view",
        Header: "View",
        Cell: ({ row: { original } }: CellProps<Role>) => (
          <OverflowingCell
            items={getPermissionLabelsByType(
              original,
              permissionOptions,
              "view",
            )}
          />
        ),
      },
      {
        accessor: "manage",
        Header: "Manage",
        Cell: ({ row: { original } }: CellProps<Role>) => (
          <OverflowingCell
            items={getPermissionLabelsByType(
              original,
              permissionOptions,
              "manage",
            )}
          />
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Cell: ({ row }: CellProps<Role>) => (
          <div className="divided-blocks">
            <div className="divided-blocks__item">
              <Button
                small
                hasIcon
                type="button"
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--top-center"
                aria-label={`Edit ${row.original.name} role`}
                onClick={() => handleEditRole(row.original)}
              >
                <span className="p-tooltip__message">Edit</span>
                <Icon name="edit" className="u-no-margin--left" />
              </Button>
            </div>
            <div className="divided-blocks__item">
              <Button
                small
                hasIcon
                type="button"
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--top-center"
                aria-label={`Delete ${row.original.name} role`}
                onClick={() => handleRemoveRoleDialog(row.original)}
              >
                <span className="p-tooltip__message">Delete</span>
                <Icon name="delete" className="u-no-margin--left" />
              </Button>
            </div>
          </div>
        ),
      },
    ],
    [roles, getPermissionsQueryResult],
  );

  return <ModularTable columns={columns} data={roles} />;
};

export default RolesList;
