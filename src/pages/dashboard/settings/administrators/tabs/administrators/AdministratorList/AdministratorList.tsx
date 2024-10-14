import { FC, HTMLProps, useMemo } from "react";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import {
  Cell,
  CellProps,
  Column,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import useAdministrators from "@/hooks/useAdministrators";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { Administrator } from "@/types/Administrator";
import { Role } from "@/types/Role";
import { SelectOption } from "@/types/SelectOption";
import EditAdministratorForm from "@/pages/dashboard/settings/administrators/tabs/administrators/EditAdministratorForm";
import AdministratorRolesCell from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorRolesCell";
import classes from "./AdministratorList.module.scss";

interface AdministratorListProps {
  administrators: Administrator[];
  emptyMessage: string;
  roles: Role[];
}

const AdministratorList: FC<AdministratorListProps> = ({
  administrators,
  emptyMessage,
  roles,
}) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { disableAdministratorQuery } = useAdministrators();

  const { mutateAsync: disableAdministrator, isPending: isDisabling } =
    disableAdministratorQuery;

  const administratorsData = useMemo(() => administrators, [administrators]);

  const roleOptions: SelectOption[] = useMemo(
    () =>
      roles.map(({ name }) => ({
        label: name,
        value: name,
      })),
    [roles],
  );

  const handleAdministratorDisabling = async (email: string) => {
    try {
      await disableAdministrator({ email });
    } catch (error) {
      debug(error);
    }
  };

  const handleAdministratorClick = (administrator: Administrator) => {
    setSidePanelContent(
      administrator.name,
      <EditAdministratorForm administrator={administrator} />,
    );
  };

  const columns = useMemo<Column<Administrator>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row }: CellProps<Administrator>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              handleAdministratorClick(row.original);
            }}
          >
            {row.original.name}
          </Button>
        ),
      },
      {
        accessor: "email",
        Header: "Email",
      },
      {
        accessor: "roles",
        className: classes.roles,
        Header: "Roles",
        Cell: ({ row }: CellProps<Administrator>) => (
          <AdministratorRolesCell
            administrator={row.original}
            roleOptions={roleOptions}
          />
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Cell: ({ row }: CellProps<Administrator>) => (
          <ConfirmationButton
            className="u-no-margin--bottom u-no-padding--left is-small has-icon"
            type="button"
            appearance="base"
            aria-label={`Remove ${row.original.name}`}
            confirmationModalProps={{
              title: `Remove ${row.original.name}`,
              children: (
                <p>
                  This will remove the administrator from your Landscape
                  organisation.
                </p>
              ),
              confirmButtonLabel: "Remove",
              confirmButtonAppearance: "negative",
              confirmButtonDisabled: isDisabling,
              confirmButtonLoading: isDisabling,
              onConfirm: () => handleAdministratorDisabling(row.original.email),
            }}
          >
            <Tooltip position="top-center" message="Remove">
              <Icon
                name={ICONS.delete}
                className="u-no-margin--left u-no-padding"
              />
            </Tooltip>
          </ConfirmationButton>
        ),
      },
    ],
    [administratorsData, roleOptions],
  );

  const handleCellProps = (cell: Cell<Administrator>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (cell.column.id === "name") {
      cellProps.role = "rowheader";
    } else if (cell.column.id === "email") {
      cellProps["aria-label"] = "Email";
    } else if (cell.column.id === "roles") {
      cellProps["aria-label"] = "Roles";
    } else if (cell.column.id === "actions") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };

  return (
    <ModularTable
      columns={columns}
      data={administratorsData}
      getCellProps={handleCellProps}
      emptyMsg={emptyMessage}
      className={classes.table}
    />
  );
};

export default AdministratorList;
