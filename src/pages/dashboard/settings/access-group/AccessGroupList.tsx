import {
  Button,
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
import useConfirm from "@/hooks/useConfirm";
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
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeAccessGroupQuery } = useRoles();
  const { mutateAsync: removeAccessGroup } = removeAccessGroupQuery;
  const debug = useDebug();
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

  const handleAccessGroupDelete = async (accessGroup: string) => {
    try {
      await removeAccessGroup({
        name: accessGroup,
      });
    } catch (error: unknown) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleAccessGroupDeleteDialog = (accessGroup: string) => {
    confirmModal({
      body: `This will delete '${accessGroup}' access group`,
      title: "Delete access group",
      buttons: [
        <Button
          key={`delete-access-group-${accessGroup}`}
          appearance="negative"
          onClick={() => handleAccessGroupDelete(accessGroup)}
          aria-label={`Delete ${accessGroup} access group`}
        >
          Delete
        </Button>,
      ],
    });
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
          return (
            <div className="divided-blocks">
              <div className="divided-blocks__item">
                <Tooltip message="Delete">
                  <Button
                    small
                    hasIcon
                    appearance="base"
                    className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                    aria-label={`Remove ${row.original.name} access group`}
                    onClick={() =>
                      handleAccessGroupDeleteDialog(row.original.name)
                    }
                  >
                    <Icon name={ICONS.delete} className="u-no-margin--left" />
                  </Button>
                </Tooltip>
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
