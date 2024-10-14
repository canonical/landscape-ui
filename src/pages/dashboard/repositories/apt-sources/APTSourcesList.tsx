import { FC, useMemo } from "react";
import {
  ConfirmationButton,
  Icon,
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { APTSource } from "@/types/APTSource";
import useDebug from "@/hooks/useDebug";
import useAPTSources from "@/hooks/useAPTSources";
import classes from "./APTSourcesList.module.scss";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";

interface APTSourcesListProps {
  items: APTSource[];
}

const APTSourcesList: FC<APTSourcesListProps> = ({ items }) => {
  const { removeAPTSourceQuery } = useAPTSources();
  const debug = useDebug();

  const { mutateAsync: removeAPTSource, isPending: isRemoving } =
    removeAPTSourceQuery;

  const handleRemoveAptSource = async (aptSourceName: string) => {
    try {
      await removeAPTSource({ name: aptSourceName });
    } catch (error) {
      debug(error);
    }
  };

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
          <ConfirmationButton
            className="u-no-margin--bottom u-no-padding--left is-small has-icon"
            type="button"
            appearance="base"
            aria-label={`Remove ${row.original.name} APT source`}
            confirmationModalProps={{
              title: `Deleting ${row.original.name} APT source`,
              children: (
                <p>
                  Are you sure? This action is permanent and cannot be undone.
                </p>
              ),
              confirmButtonLabel: "Delete",
              confirmButtonAppearance: "negative",
              confirmButtonLoading: isRemoving,
              confirmButtonDisabled: isRemoving,
              onConfirm: () => handleRemoveAptSource(row.original.name),
            }}
          >
            <Tooltip position="btm-center" message="Delete">
              <Icon name={ICONS.delete} />
            </Tooltip>
          </ConfirmationButton>
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
