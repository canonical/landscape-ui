import { FC } from "react";
import {
  Button,
  Icon,
  ICONS,
  MainTable,
  Spinner,
} from "@canonical/react-components";
import { GPGKey } from "../../../../types/GPGKey";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useGPGKeys from "../../../../hooks/useGPGKeys";
import classes from "./GPGKeysList.module.scss";

interface GPGKeysListProps {
  items: GPGKey[];
}

const GPGKeysList: FC<GPGKeysListProps> = ({ items }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeGPGKeyQuery } = useGPGKeys();
  const debug = useDebug();

  const { mutateAsync: removeGPGKey, isLoading: isRemoving } =
    removeGPGKeyQuery;

  const headers = [
    { content: "Name" },
    { content: "Access type" },
    { content: "Fingerprint" },
    {},
  ];

  const rows = items.map((item) => {
    return {
      columns: [
        {
          content: item.name,
          role: "rowheader",
          "aria-label": "Name",
        },
        {
          content: item.has_secret ? "Private" : "Public",
          "aria-label": "Access type",
        },
        {
          content: item.fingerprint,
          "aria-label": "Fingerprint",
        },
        {
          className: "u-align--right",
          content: (
            <Button
              small
              hasIcon
              appearance="base"
              className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
              aria-label={`Remove ${item.name} GPG key`}
              onClick={() => {
                confirmModal({
                  body: "Are you sure? This action is permanent and can not be undone.",
                  title: "Deleting GPG key",
                  buttons: [
                    <Button
                      key={`delete-key-${item.fingerprint}`}
                      appearance="negative"
                      hasIcon={true}
                      onClick={async () => {
                        try {
                          await removeGPGKey({ name: item.name });
                          closeConfirmModal();
                        } catch (error: unknown) {
                          debug(error);
                        }
                      }}
                      aria-label={`Delete ${item.name} GPG key`}
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
    };
  });

  return (
    <MainTable
      headers={headers}
      rows={rows}
      emptyStateMsg="No pockets yet"
      className={classes.content}
    />
  );
};

export default GPGKeysList;
