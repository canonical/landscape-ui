import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import { ConfirmationModal } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { AccessGroupWithInstancesCount } from "../../types";

interface AccessGroupListActionsProps {
  readonly accessGroup: AccessGroupWithInstancesCount;
}

const AccessGroupListActions: FC<AccessGroupListActionsProps> = ({
  accessGroup,
}) => {
  const debug = useDebug();

  const { removeAccessGroupQuery } = useRoles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: remove, isPending: isRemoving } = removeAccessGroupQuery;

  const tryRemove = async () => {
    try {
      await remove({
        name: accessGroup.name,
      });
    } catch (error) {
      debug(error);
    }

    closeModal();
  };

  return (
    <>
      <ListActions
        toggleAriaLabel={`${accessGroup.title} access group actions`}
        destructiveActions={[
          {
            icon: "delete",
            label: "Delete",
            "aria-label": `Delete "${accessGroup.title}" access group`,
            onClick: openModal,
          },
        ]}
      />

      {isModalOpen && (
        <ConfirmationModal
          title={`Deleting ${accessGroup.title} access group`}
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={tryRemove}
          close={closeModal}
        >
          <p>Are you sure?</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AccessGroupListActions;
