import ListActions from "@/components/layout/ListActions";
import useAdministrators from "@/hooks/useAdministrators";
import useDebug from "@/hooks/useDebug";
import type { Administrator } from "@/types/Administrator";
import { ConfirmationModal } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";

interface AdministratorListActionsProps {
  readonly administrator: Administrator;
}

const AdministratorListActions: FC<AdministratorListActionsProps> = ({
  administrator,
}) => {
  const debug = useDebug();

  const { disableAdministratorQuery } = useAdministrators();
  const { mutateAsync: disable, isPending: isDisabling } =
    disableAdministratorQuery;

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const tryDisable = async () => {
    try {
      await disable({ email: administrator.email });
    } catch (error) {
      debug(error);
    }

    closeModal();
  };

  return (
    <>
      <ListActions
        toggleAriaLabel={`${administrator.name} administrator actions`}
        destructiveActions={[
          {
            icon: "delete",
            label: "Remove",
            "aria-label": `Remove "${administrator.name}" administrator`,
            onClick: openModal,
          },
        ]}
      />

      {isModalOpen && (
        <ConfirmationModal
          close={closeModal}
          title={`Remove ${administrator.name}`}
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isDisabling}
          confirmButtonLoading={isDisabling}
          onConfirm={tryDisable}
        >
          <p>
            This will remove the administrator from your Landscape organisation.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AdministratorListActions;
