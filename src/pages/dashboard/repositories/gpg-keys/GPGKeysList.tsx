import { FC, useMemo } from "react";
import {
  Button,
  Icon,
  ICONS,
  ModularTable,
  Spinner,
} from "@canonical/react-components";
import { GPGKey } from "../../../../types/GPGKey";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useGPGKeys from "../../../../hooks/useGPGKeys";
import classes from "./GPGKeysList.module.scss";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";

interface GPGKeysListProps {
  items: GPGKey[];
}

const GPGKeysList: FC<GPGKeysListProps> = ({ items }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeGPGKeyQuery } = useGPGKeys();
  const debug = useDebug();

  const { mutateAsync: removeGPGKey, isLoading: isRemoving } =
    removeGPGKeyQuery;

  const columns = useMemo<Column<GPGKey>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        role: "rowheader",
        "aria-label": "Name",
      },
      {
        accessor: "has_secret",
        Header: "Access type",
        Cell: ({ row }: CellProps<GPGKey>) =>
          row.original.has_secret ? "Private" : "Public",
        "aria-label": "Access type",
        className: classes.accessType,
      },
      {
        accessor: "fingerprint",
        Header: "Fingerprint",
        "aria-label": "Fingerprint",
        className: classes.fingerprint,
      },
      {
        accessor: "id",
        "aria-label": "Actions",
        className: classes.actions,
        Cell: ({ row }: CellProps<GPGKey>) => (
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left p-tooltip--top-center"
            aria-label={`Remove ${row.original.name} GPG key`}
            onClick={() => {
              confirmModal({
                body: "Are you sure? This action is permanent and can not be undone.",
                title: `Deleting ${row.original.name} GPG key`,
                buttons: [
                  <Button
                    key={`delete-key-${row.original.fingerprint}`}
                    appearance="negative"
                    hasIcon={true}
                    onClick={async () => {
                      try {
                        await removeGPGKey({ name: row.original.name });
                      } catch (error: unknown) {
                        debug(error);
                      } finally {
                        closeConfirmModal();
                      }
                    }}
                    aria-label={`Delete ${row.original.name} GPG key`}
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
        ),
      },
    ],
    [],
  );

  return (
    <ModularTable
      columns={columns}
      data={useMemo(() => items, [])}
      emptyMsg="You have no GPG keys yet."
    />
  );
};

export default GPGKeysList;
