import { FC, lazy, Suspense, useState } from "react";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  MenuLink,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { IdentityProvider } from "../../types";
import classes from "./ProviderListActions.module.scss";
import { useAuthHandle } from "../../hooks";
import useDebug from "@/hooks/useDebug";

const ProviderForm = lazy(() => import("../ProviderForm"));

interface ProviderListActionsProps {
  canBeDisabled: boolean;
  provider: IdentityProvider;
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

  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit ${provider.name} provider`,
      hasIcon: true,
      onClick: handleIdentityProviderEdit,
    },
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Delete</span>
        </>
      ),
      "aria-label": `Delete ${provider.name} provider`,
      hasIcon: true,
      onClick: handleOpenModal,
      disabled: provider.provider === "ubuntu-one",
    },
  ];

  return (
    <>
      <ContextualMenu
        position="left"
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${provider.name} provider actions` }}
        links={contextualMenuButtons}
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
