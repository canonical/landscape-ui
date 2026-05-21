import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import { ConfirmationModal, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useAuthHandle } from "../../hooks";
import type { IdentityProvider } from "../../types";

interface ProviderListActionsProps {
  readonly canBeDisabled: boolean;
  readonly provider: IdentityProvider;
}

const ProviderListActions: FC<ProviderListActionsProps> = ({
  provider,
}) => {
  const { setPageParams } = usePageParams();
  const debug = useDebug();

  const { deleteProviderQuery } = useAuthHandle();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: deleteProvider, isPending: isRemoving } =
    deleteProviderQuery;

  const handleIdentityProviderEdit = () => {
    setPageParams({ sidePath: ["edit"], name: String(provider.id) });
  };

  const handleProviderDelete = async () => {
    try {
      await deleteProvider({ providerId: provider.id });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${provider.name} provider`,
      onClick: handleIdentityProviderEdit,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: ICONS.delete,
      label: "Delete",
      "aria-label": `Delete ${provider.name} provider`,
      onClick: openModal,
      disabled: provider.provider === "ubuntu-one",
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${provider.name} provider actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />
      {isModalOpen && (
        <ConfirmationModal
          title="Delete identity provider"
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={handleProviderDelete}
          close={closeModal}
        >
          <p>This will delete the {provider.name} provider.</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default ProviderListActions;
