import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import ListActions from "@/components/layout/ListActions";
import { useBoolean } from "usehooks-ts";
import RemoveLocalRepositoryModal from "../../../RemoveLocalRepositoryModal";
import { useGetRepositoryActions } from "../../../../hooks";
import PublishLocalRepositoryGuard from "../../../PublishLocalRepositoryGuard";

interface LocalRepositoriesListActionsProps {
  readonly repository: Local;
  readonly inProgress: boolean;
}

const LocalRepositoriesListActions: FC<LocalRepositoriesListActionsProps> = ({
  repository,
  inProgress,
}) => {
  const {
    value: isRemovalModalOpen,
    setTrue: openRemovalModal,
    setFalse: closeRemovalModal,
  } = useBoolean();

  const {
    value: isPublishGuardOpen,
    setTrue: openPublishGuard,
    setFalse: closePublishGuard,
  } = useBoolean();

  const { viewAction, actions, destructiveAction } = useGetRepositoryActions({
    repository,
    inProgress,
    openRemovalModal,
    openPublishGuard,
  });

  return (
    <>
      <ListActions
        toggleAriaLabel={`${repository.displayName} actions`}
        actions={[viewAction, ...actions]}
        destructiveActions={[destructiveAction]}
      />

      <RemoveLocalRepositoryModal
        close={closeRemovalModal}
        isOpen={isRemovalModalOpen}
        repository={repository}
      />

      <PublishLocalRepositoryGuard
        close={closePublishGuard}
        isOpen={isPublishGuardOpen}
        repository={repository}
      />
    </>
  );
};

export default LocalRepositoriesListActions;
