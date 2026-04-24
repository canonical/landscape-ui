import type { FC } from "react";
import type { Local } from "../../../../types";
import ListActions from "@/components/layout/ListActions";
import { useBoolean } from "usehooks-ts";
import RemoveLocalRepositoryModal from "../../../RemoveLocalRepositoryModal";
import { useGetRepositoryActions } from "../../../../hooks";
import PublishLocalRepositoryGuard from "../../../PublishLocalRepositoryGuard";

interface LocalRepositoriesListActionsProps {
  readonly repository: Local;
}

const LocalRepositoriesListActions: FC<LocalRepositoriesListActionsProps> = ({
  repository,
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

  const { viewAction, actions, destructiveActions } = useGetRepositoryActions({
    repository,
    openRemovalModal,
    openPublishGuard,
  });

  return (
    <>
      <ListActions
        toggleAriaLabel={`${repository.display_name} actions`}
        actions={[viewAction, ...actions]}
        destructiveActions={destructiveActions}
      />

      {isRemovalModalOpen && (
        <RemoveLocalRepositoryModal
          close={closeRemovalModal}
          repository={repository}
        />
      )}

      {isPublishGuardOpen && (
        <PublishLocalRepositoryGuard
          close={closePublishGuard}
          repository={repository}
        />
      )}
    </>
  );
};

export default LocalRepositoriesListActions;
