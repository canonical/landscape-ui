import { FC, HTMLProps, useMemo } from "react";
import {
  Button,
  Icon,
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { GPGKey } from "@/types/GPGKey";
import useConfirm from "@/hooks/useConfirm";
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
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeGPGKeyQuery } = useGPGKeys();
  const debug = useDebug();

  const { mutateAsync: removeGPGKey } = removeGPGKeyQuery;

  const gpgKeys = useMemo(() => items, [items.length]);

  const handleRemoveGPGKey = async (name: string) => {
    try {
      await removeGPGKey({ name });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveGPGKeyDialog = (name: string) => {
    confirmModal({
      body: "Are you sure? This action is permanent and can not be undone.",
      title: `Deleting ${name} GPG key`,
      buttons: [
        <Button
          key={`delete-key-${name}`}
          appearance="negative"
          hasIcon={true}
          onClick={() => handleRemoveGPGKey(name)}
          aria-label={`Delete ${name} GPG key`}
        >
          Delete
        </Button>,
      ],
    });
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
              <Tooltip message="Delete" position="top-center">
                <Button
                  small
                  hasIcon
                  appearance="base"
                  className="u-no-margin--bottom u-no-padding--left"
                  aria-label={`Remove ${row.original.name} GPG key`}
                  onClick={() => handleRemoveGPGKeyDialog(row.original.name)}
                >
                  <Icon name={ICONS.delete} className="u-no-margin--left" />
                </Button>
              </Tooltip>
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
