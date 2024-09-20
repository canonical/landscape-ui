import { FC, useMemo } from "react";
import { Button, Icon, ICONS, ModularTable } from "@canonical/react-components";
import { APTSource } from "../../../../types/APTSource";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useAPTSources from "../../../../hooks/useAPTSources";
import classes from "./APTSourcesList.module.scss";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";

interface APTSourcesListProps {
  items: APTSource[];
}

const APTSourcesList: FC<APTSourcesListProps> = ({ items }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeAPTSourceQuery } = useAPTSources();
  const debug = useDebug();

  const { mutateAsync: removeAPTSource } = removeAPTSourceQuery;

  const columns = useMemo<Column<APTSource>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "access_group",
        Header: "Access group",
        className: classes.accessGroup,
      },
      {
        accessor: "line",
        Header: "Line",
        className: classes.line,
      },
      {
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<APTSource>) => (
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
            aria-label={`Remove ${row.original.name} APT source`}
            onClick={() => {
              confirmModal({
                body: "Are you sure? This action is permanent and can not be undone.",
                title: `Deleting ${row.original.name} APT source`,
                buttons: [
                  <Button
                    key={`delete-key-${row.original.id}`}
                    appearance="negative"
                    hasIcon={true}
                    onClick={async () => {
                      try {
                        await removeAPTSource({ name: row.original.name });
                      } catch (error: unknown) {
                        debug(error);
                      } finally {
                        closeConfirmModal();
                      }
                    }}
                    aria-label={`Delete ${row.original.name} APT source`}
                  >
                    Delete
                  </Button>,
                ],
              });
            }}
          >
            <span className="p-tooltip__message">Delete</span>
            <Icon name={ICONS.delete} className="u-no-margin--left" />
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <ModularTable
      columns={columns}
      data={useMemo(() => items, [items.length])}
      emptyMsg="No APT sources yet."
      getCellProps={({ column }) => {
        switch (column.id) {
          case "name":
            return { role: "rowheader" };
          case "access_group":
            return { "aria-label": "Access group" };
          case "line":
            return { "aria-label": "Line" };
          case "id":
            return { "aria-label": "Actions" };
          default:
            return {};
        }
      }}
    />
  );
};

export default APTSourcesList;
