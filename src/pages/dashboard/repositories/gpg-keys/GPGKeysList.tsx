import { FC } from "react";
import { Button, Icon, ICONS, MainTable } from "@canonical/react-components";
import { GPGKey } from "../../../../types/GPGKey";
import { boolToLabel } from "../../../../utils/output";
import useConfirm from "../../../../hooks/useConfirm";

interface GPGKeysListProps {
  items: GPGKey[];
}

const GPGKeysList: FC<GPGKeysListProps> = ({ items }) => {
  const { confirmModal, closeConfirmModal } = useConfirm();

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
          "aria-label": "delete-item",
          role: "button",
          content: (
            <Button
              appearance="base"
              hasIcon={true}
              onClick={() => {
                confirmModal({
                  body: "This action is permanent and can not be undone.",
                  buttons: [
                    <Button
                      key={`delete-key-${item.fingerprint}`}
                      appearance="negative"
                      hasIcon={true}
                      onClick={() => {
                        if (confirm("Delete!")) {
                          closeConfirmModal();
                        }
                      }}
                    >
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
