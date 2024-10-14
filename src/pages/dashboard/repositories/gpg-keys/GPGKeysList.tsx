import { FC, HTMLProps, useMemo } from "react";
import {
  ConfirmationButton,
  Icon,
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { GPGKey } from "@/types/GPGKey";
import useDebug from "@/hooks/useDebug";
import useGPGKeys from "@/hooks/useGPGKeys";
import classes from "./GPGKeysList.module.scss";
import {
  CellProps,
  Column,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";

interface GPGKeysListProps {
  items: GPGKey[];
}

const GPGKeysList: FC<GPGKeysListProps> = ({ items }) => {
  const { removeGPGKeyQuery } = useGPGKeys();
  const debug = useDebug();

  const { mutateAsync: removeGPGKey, isPending: isRemoving } =
    removeGPGKeyQuery;

  const gpgKeys = useMemo(() => items, [items.length]);

  const handleRemoveGPGKey = async (name: string) => {
    try {
      await removeGPGKey({ name });
    } catch (error) {
      debug(error);
    }
  };

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
        accessor: "actions",
        className: classes.actions,
        Cell: ({ row }: CellProps<GPGKey>) => (
          <div className="divided-blocks">
            <div className="divided-blocks__item">
              <ConfirmationButton
                className="u-no-margin--bottom u-no-padding--left is-small has-icon"
                type="button"
                appearance="base"
                aria-label={`Remove ${row.original.name} GPG key`}
                confirmationModalProps={{
                  title: `Deleting ${row.original.name} GPG key`,
                  children: (
                    <p>
                      Are you sure? This action is permanent and cannot be
                      undone.
                    </p>
                  ),
                  confirmButtonLabel: "Delete",
                  confirmButtonAppearance: "negative",
                  confirmButtonLoading: isRemoving,
                  confirmButtonDisabled: isRemoving,
                  onConfirm: () => handleRemoveGPGKey(row.original.name),
                }}
              >
                <Tooltip position="top-center" message="Delete">
                  <Icon name={ICONS.delete} />
                </Tooltip>
              </ConfirmationButton>
            </div>
          </div>
        ),
      },
    ],
    [gpgKeys],
  );

  return (
    <ModularTable
      columns={columns}
      data={gpgKeys}
      getCellProps={({ column }) => {
        const cellProps: Partial<
          TableCellProps & HTMLProps<HTMLTableCellElement>
        > = {};

        if (column.id === "name") {
          cellProps.role = "rowheader";
        } else if (column.id === "has_secret") {
          cellProps["aria-label"] = "Access type";
        } else if (column.id === "fingerprint") {
          cellProps["aria-label"] = "Fingerprint";
        } else if (column.id === "actions") {
          cellProps["aria-label"] = "Actions";
        }

        return cellProps;
      }}
      emptyMsg="You have no GPG keys yet."
    />
  );
};

export default GPGKeysList;
