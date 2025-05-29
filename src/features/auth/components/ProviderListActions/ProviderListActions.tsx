import type { ListAction } from "@/components/layout/ListActions";
import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { ConfirmationModal, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
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
  const { setSidePanelContent } = useSidePanel();
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

  const handleProviderDelete = async () => {
    try {
      await deleteProvider({ providerId: provider.id });

      closeModal();
    } catch (error) {
      debug(error);
    }
  };

  const actions: ListAction[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${provider.name} provider`,
      onClick: handleIdentityProviderEdit,
    },
  ];

  const destructiveActions: ListAction[] = [
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
