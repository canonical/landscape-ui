import {
  Button,
  ICONS,
  Icon,
  ModularTable,
  Spinner,
} from "@canonical/react-components";
import { FC, useMemo } from "react";
import { Cell, CellProps, Column } from "react-table";
import useAccessGroup from "../../../../hooks/useAccessGroup";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import { AccessGroup } from "../../../../types/AccessGroup";
import classes from "./AccessGroupsList.module.scss";

interface AccessGroupListProps {
  accessGroupData: AccessGroup[];
}
interface IndentedAccessGroup extends AccessGroup, Record<string, unknown> {
  indentLevel: number;
}

const AccessGroupList: FC<AccessGroupListProps> = ({ accessGroupData }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeAccessGroupQuery } = useAccessGroup();
  const { mutateAsync: removeAccessGroup, isLoading: isRemoving } =
    removeAccessGroupQuery;
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
            <div className={classes.dividedBlocks}>
              <div className={classes.dividedBlock}>
                <Button
                  small
                  hasIcon
                  appearance="base"
                  className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                  aria-label={`Remove ${row.original.name} access group`}
                  onClick={() => {
                    confirmModal({
                      body: "Are you sure?",
                      title: `Deleting ${row.original.name} access group`,
                      buttons: [
                        <Button
                          key={`delete-access-group-${row.original.name}`}
                          appearance="negative"
                          hasIcon={true}
                          onClick={async () => {
                            try {
                              await removeAccessGroup({
                                name: row.original.name,
                              });
                            } catch (error: unknown) {
                              debug(error);
                            } finally {
                              closeConfirmModal();
                            }
                          }}
                          aria-label={`Delete ${row.original.name} access group`}
                        >
                          {isRemoving && <Spinner />}
                          Delete
                        </Button>,
                      ],
                    });
                  }}
                >
                  <span className="p-tooltip__message">Delete</span>
                  <Icon name={ICONS.delete} className="u-no-margin--left" />
                </Button>
              </div>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <ModularTable
        columns={columns}
        data={indentedData}
        getCellProps={(cell: Cell<IndentedAccessGroup, any>) => {
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
