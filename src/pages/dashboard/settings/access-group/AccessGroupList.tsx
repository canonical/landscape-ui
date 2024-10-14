import {
  ConfirmationButton,
  Icon,
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { FC, useMemo } from "react";
import {
  Cell,
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import useRoles from "@/hooks/useRoles";
import useDebug from "@/hooks/useDebug";
import { AccessGroup } from "@/types/AccessGroup";
import classes from "./AccessGroupsList.module.scss";

interface AccessGroupListProps {
  accessGroupData: AccessGroup[];
}

interface IndentedAccessGroup extends AccessGroup, Record<string, unknown> {
  indentLevel: number;
}

const AccessGroupList: FC<AccessGroupListProps> = ({ accessGroupData }) => {
  const { removeAccessGroupQuery } = useRoles();
  const debug = useDebug();

  const { mutateAsync: removeAccessGroup, isPending: isRemoving } =
    removeAccessGroupQuery;

  const prepareData = (data: AccessGroup[], parent = "", indentLevel = 0) => {
    let result: IndentedAccessGroup[] = [];
    data
      .filter((item) => item.parent === parent)
      .forEach((item) => {
        result.push({ ...item, indentLevel });
        result = result.concat(prepareData(data, item.name, indentLevel + 1));
      });
    return result;
  };

  const indentedData = useMemo(() => {
    const sortedData =
      accessGroupData.sort((a, b) => a.name.localeCompare(b.name)) || [];

    return prepareData(sortedData);
  }, [accessGroupData.length]);

  const handleRemoveAccessGroup = async (accessGroupName: string) => {
    try {
      await removeAccessGroup({
        name: accessGroupName,
      });
    } catch (error) {
      debug(error);
    }
  };

  const columns = useMemo<Column<IndentedAccessGroup>[]>(
    () => [
      {
        accessor: "title",
        Header: "Title",
        className: classes.name,
      },
      {
        accessor: "name",
        Header: "Name",
        className: classes.name,
      },
      {
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<IndentedAccessGroup>) => {
          if (row.original.name === "global") {
            return null;
          }

          return (
            <div className="divided-blocks">
              <div className="divided-blocks__item">
                <ConfirmationButton
                  className="u-no-margin--bottom u-no-padding--left is-small has-icon"
                  type="button"
                  appearance="base"
                  aria-label={`Remove ${row.original.name} access group`}
                  confirmationModalProps={{
                    title: `Deleting ${row.original.name} access group`,
                    children: <p>Are you sure?</p>,
                    confirmButtonLabel: "Delete",
                    confirmButtonAppearance: "negative",
                    confirmButtonDisabled: isRemoving,
                    confirmButtonLoading: isRemoving,
                    onConfirm: () => handleRemoveAccessGroup(row.original.name),
                  }}
                >
                  <Tooltip position="btm-center" message="Delete">
                    <Icon name={ICONS.delete} />
                  </Tooltip>
                </ConfirmationButton>
              </div>
            </div>
          );
        },
      },
    ],
    [indentedData],
  );

  return (
    <>
      <ModularTable
        columns={columns}
        data={indentedData}
        getCellProps={(cell: Cell<IndentedAccessGroup>) => {
          const rowData = cell.row.original as IndentedAccessGroup;
          switch (cell.column.id) {
            case "name":
              return {
                role: "rowheader",
              };
            case "title":
              return {
                "aria-label": "Title",
                style: { paddingLeft: `${rowData.indentLevel * 2}rem` },
              };
            case "id":
              return { "aria-label": "Actions" };
            default:
              return {};
          }
        }}
      />
    </>
  );
};

export default AccessGroupList;
