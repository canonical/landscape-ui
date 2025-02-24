import useDebug from "@/hooks/useDebug";
import {
  ConfirmationButton,
  Icon,
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import type { FC } from "react";
import { useMemo } from "react";
import { useAPTSources } from "../../hooks";
import type { APTSource } from "../../types";
import classes from "./APTSourcesList.module.scss";
import { handleCellProps } from "./helpers";

interface APTSourcesListProps {
  readonly items: APTSource[];
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
      getCellProps={handleCellProps}
    />
  );
};

export default APTSourcesList;
