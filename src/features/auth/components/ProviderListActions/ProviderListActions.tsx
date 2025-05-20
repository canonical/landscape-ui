import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { ConfirmationModal, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useAuthHandle } from "../../hooks";
import type { IdentityProvider } from "../../types";

const ProviderForm = lazy(async () => import("../ProviderForm"));

interface ProviderListActionsProps {
  readonly canBeDisabled: boolean;
  readonly provider: IdentityProvider;
}

const ProviderListActions: FC<ProviderListActionsProps> = ({
  canBeDisabled,
  provider,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();
  const debug = useDebug();
  const { deleteProviderQuery } = useAuthHandle();

  const { mutateAsync: deleteProvider, isPending: isRemoving } =
    deleteProviderQuery;

  const handleIdentityProviderEdit = () => {
    setSidePanelContent(
      `Edit ${provider.name} provider`,
      <Suspense fallback={<LoadingState />}>
        <ProviderForm
          action="edit"
          canBeDisabled={canBeDisabled}
          provider={provider}
        />
      </Suspense>,
    );
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleProviderDelete = async () => {
    try {
      await deleteProvider({ providerId: provider.id });

      handleCloseModal();
    } catch (error) {
      debug(error);
    }
  };

  const actions = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${provider.name} provider`,
      onClick: handleIdentityProviderEdit,
    },
  ];

  const destructiveActions = [
    {
      icon: ICONS.delete,
      label: "Delete",
      "aria-label": `Delete ${provider.name} provider`,
      onClick: handleOpenModal,
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
      {modalOpen && (
        <ConfirmationModal
          title="Delete identity provider"
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={handleProviderDelete}
          close={handleCloseModal}
        >
          <p>This will delete the {provider.name} provider.</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default ProviderListActions;
