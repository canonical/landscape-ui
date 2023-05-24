import { FC } from "react";
import {
  Button,
  Icon,
  ICONS,
  MainTable,
  Spinner,
} from "@canonical/react-components";
import { GPGKey } from "../../../../types/GPGKey";
import { boolToLabel } from "../../../../utils/output";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useGPGKeys from "../../../../hooks/useGPGKeys";

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
    { content: "Has secret" },
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
          content: boolToLabel(item.has_secret),
          "aria-label": "Has secret",
        },
        {
          content: item.fingerprint,
          "aria-label": "Fingerprint",
        },
        {
          className: "u-align--right",
          content: (
            <Button
              hasIcon
              appearance="base"
              className="u-no-margin--bottom"
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
                    >
                      {isRemoving && <Spinner />}
                      Delete
                    </Button>,
                  ],
                });
              }}
            >
              <Icon name={ICONS.delete} />
            </Button>
          ),
        },
      ],
    };
  });

  return (
    <MainTable headers={headers} rows={rows} emptyStateMsg="No pockets yet" />
  );
};

export default GPGKeysList;
