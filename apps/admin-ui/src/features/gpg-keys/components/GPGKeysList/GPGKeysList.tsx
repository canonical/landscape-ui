import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import { ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { GPGKey } from "../../types";
import GPGKeysListActions from "../GPGKeysListActions";
import classes from "./GPGKeysList.module.scss";
import { handleCellProps } from "./helpers";

interface GPGKeysListProps {
  readonly items: GPGKey[];
}

const GPGKeysList: FC<GPGKeysListProps> = ({ items }) => {
  const gpgKeys = useMemo(() => items, [items.length]);

  const columns = useMemo<Column<GPGKey>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "has_secret",
        Header: "Access type",
        className: classes.accessType,
        Cell: ({ row }: CellProps<GPGKey>) =>
          row.original.has_secret ? "Private" : "Public",
      },
      {
        accessor: "fingerprint",
        Header: "Fingerprint",
        className: classes.fingerprint,
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<GPGKey>) => (
          <GPGKeysListActions gpgKey={row.original} />
        ),
      },
    ],
    [gpgKeys],
  );

  return (
    <ModularTable
      columns={columns}
      data={gpgKeys}
      getCellProps={handleCellProps}
      emptyMsg="You have no GPG keys yet."
    />
  );
};

export default GPGKeysList;
