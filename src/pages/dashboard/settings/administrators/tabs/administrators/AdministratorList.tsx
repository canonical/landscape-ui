import { FC, HTMLProps, useMemo } from "react";
import { Administrator } from "../../../../../../types/Administrator";
import { Role } from "../../../../../../types/Role";
import {
  Button,
  Icon,
  ICONS,
  ModularTable,
  Spinner,
} from "@canonical/react-components";
import { Cell, CellProps, Column, TableCellProps } from "react-table";
import useDebug from "../../../../../../hooks/useDebug";
import useConfirm from "../../../../../../hooks/useConfirm";
import useAdministrators from "../../../../../../hooks/useAdministrators";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import EditAdministratorForm from "./EditAdministratorForm";
import classes from "./AdministratorList.module.scss";
import AdministratorRolesCell from "./AdministratorRolesCell";
import { SelectOption } from "../../../../../../types/SelectOption";

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
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { disableAdministratorQuery } = useAdministrators();

  const { mutateAsync: disableAdministrator, isLoading: isDisabling } =
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
    } finally {
      closeConfirmModal();
    }
  };

  const handleAdministratorDisablingDialog = (administrator: Administrator) => {
    confirmModal({
      body: "This will remove the administrator from your Landscape organisation.",
      title: `Remove ${administrator.name}`,
      buttons: [
        <Button
          key={`remove-administrator-${administrator.id}`}
          appearance="negative"
          hasIcon
          onClick={() => handleAdministratorDisabling(administrator.email)}
          aria-label={`Remove ${administrator.name}`}
        >
          {isDisabling && <Spinner />}
          <span>Remove</span>
        </Button>,
      ],
    });
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
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left p-tooltip--top-center"
            aria-label={`Remove ${row.original.name}`}
            onClick={() => handleAdministratorDisablingDialog(row.original)}
          >
            <span className="p-tooltip__message">Remove</span>
            <Icon name={ICONS.delete} className="u-no-margin--left" />
          </Button>
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
