import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import { ConfirmationModal, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGPGKeys } from "../../hooks";
import type { GPGKey } from "../../types";

interface GPGKeysListActionsProps {
  readonly gpgKey: GPGKey;
}

const GPGKeysListActions: FC<GPGKeysListActionsProps> = ({ gpgKey }) => {
  const debug = useDebug();

  const { removeGPGKeyQuery } = useGPGKeys();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: remove, isPending: isRemoving } = removeGPGKeyQuery;

  const tryRemove = async () => {
    try {
      await remove({ name: gpgKey.name });
    } catch (error) {
      debug(error);
    }

    closeModal();
  };

  return (
    <>
      <ListActions
        toggleAriaLabel={`${gpgKey.name} GPG key actions`}
        destructiveActions={[
          {
            icon: ICONS.delete,
            label: "Remove",
            "aria-label": `Remove ${gpgKey.name} GPG key`,
            onClick: openModal,
          },
        ]}
      />

      {isModalOpen && (
        <ConfirmationModal
          close={closeModal}
          title={`Deleting ${gpgKey.name} GPG key`}
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonLoading={isRemoving}
          confirmButtonDisabled={isRemoving}
          onConfirm={tryRemove}
        >
          <p>Are you sure? This action is permanent and cannot be undone.</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default GPGKeysListActions;
