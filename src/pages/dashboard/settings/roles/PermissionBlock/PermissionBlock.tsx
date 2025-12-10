import type { PermissionOption } from "@/pages/dashboard/settings/roles/types";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./PermissionBlock.module.scss";

interface PermissionBlockProps {
  readonly description: string;
  readonly onPermissionChange: (newPermissions: string[]) => void;
  readonly options: PermissionOption[];
  readonly permissions: string[];
  readonly title: string;
}

const PermissionBlock: FC<PermissionBlockProps> = ({
  description,
  onPermissionChange,
  options,
  permissions,
  title,
}) => {
  const optionData = useMemo(
    () =>
      options.sort((a, b) => {
        if (a.values.view === "" && b.values.view !== "") {
          return -1;
        }

        if (a.values.view !== "" && b.values.view === "") {
          return 1;
        }

        return a.label.localeCompare(b.label);
      }),
    [options],
  );

  const isOptionDisabled = (option: PermissionOption) => {
    return (
      option.values.view === "" ||
      (permissions as unknown[]).includes(
        options.find(({ label }) => label === option.label)?.values.manage,
      )
    );
  };

  const handlePermissionChange = (
    permissionOption: PermissionOption,
    type: "view" | "manage",
  ) => {
    if (permissions.includes(permissionOption.values[type])) {
      onPermissionChange(
        permissions.filter(
          (currentPermission) =>
            currentPermission !== permissionOption.values[type],
        ),
      );
    } else {
      if (type === "view") {
        onPermissionChange([...permissions, permissionOption.values.view]);
      } else {
        onPermissionChange(
          permissionOption.values.view !== "" &&
            !permissions.includes(permissionOption.values.view)
            ? [
                ...permissions,
                permissionOption.values.manage,
                permissionOption.values.view,
              ]
            : [...permissions, permissionOption.values.manage],
        );
      }
    }
  };

  const columns = useMemo<Column<PermissionOption>[]>(
    () => [
      {
        accessor: "label",
        Header: "Property",
        Cell: ({ row }: CellProps<PermissionOption>) =>
          row.original.label.replace(/^\w/, (character) =>
            character.toUpperCase(),
          ),
      },
      {
        accessor: "view",
        className: classes.checkboxColumn,
        Header: "View",
        Cell: ({ row }: CellProps<PermissionOption>) => (
          <CheckboxInput
            inline
            label={
              <span className="u-off-screen">{`View ${row.original.label}`}</span>
            }
            name="permissions"
            value={row.original.values.view}
            disabled={isOptionDisabled(row.original)}
            checked={
              row.original.values.view === "" ||
              permissions.includes(row.original.values.view)
            }
            onChange={() => {
              handlePermissionChange(row.original, "view");
            }}
          />
        ),
      },
      {
        accessor: "manage",
        className: classes.checkboxColumn,
        Header: "Manage",
        Cell: ({ row }: CellProps<PermissionOption>) => (
          <CheckboxInput
            inline
            label={
              <span className="u-off-screen">{`Manage ${row.original.label}`}</span>
            }
            name="permissions"
            value={row.original.values.manage}
            disabled={row.original.values.manage === ""}
            checked={permissions.includes(row.original.values.manage)}
            onChange={() => {
              handlePermissionChange(row.original, "manage");
            }}
          />
        ),
      },
    ],
    [optionData, permissions.length],
  );

  return (
    <div className={classes.container}>
      <p className="p-heading--5 u-no-margin--bottom">{title}</p>
      <p className="p-text--small u-text--muted">{description}</p>
      <ModularTable
        columns={columns}
        data={optionData}
        getHeaderProps={() => ({ className: "u-text--muted" })}
      />
    </div>
  );
};

export default PermissionBlock;
