import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import { ConfirmationModal, ICONS } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useAPTSources } from "../../hooks";
import type { APTSource } from "../../types";

interface APTSourcesListActionsProps {
  readonly aptSource: APTSource;
}

const APTSourcesListActions: FC<APTSourcesListActionsProps> = ({
  aptSource,
}) => {
  const { removeAPTSourceQuery } = useAPTSources();
  const debug = useDebug();

  const { mutateAsync: remove, isPending: isRemoving } = removeAPTSourceQuery;

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const tryRemove = async () => {
    try {
      await remove({ name: aptSource.name });
    } catch (error) {
      debug(error);
    }

    closeModal();
  };

  return (
    <>
      <ListActions
        toggleAriaLabel={`${aptSource.name} APT source actions`}
        destructiveActions={[
          {
            icon: ICONS.delete,
            label: "Delete",
            "aria-label": `Delete "${aptSource.name}" access group`,
            onClick: openModal,
          },
        ]}
      />

      {isModalOpen && (
        <ConfirmationModal
          close={closeModal}
          title={`Deleting ${aptSource.name} APT source`}
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

export default APTSourcesListActions;
