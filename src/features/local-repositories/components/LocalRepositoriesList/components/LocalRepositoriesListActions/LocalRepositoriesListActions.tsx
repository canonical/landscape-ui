import type { FC } from "react";
import type { LocalRepository } from "../../../../types";
import ListActions from "@/components/layout/ListActions";
import { useBoolean } from "usehooks-ts";
import RemoveLocalRepositoryModal from "../../../RemoveLocalRepositoryModal";
import { useGetRepositoryActions } from "../../../../hooks";

interface LocalRepositoriesListActionsProps {
  readonly repository: LocalRepository;
}

const LocalRepositoriesListActions: FC<LocalRepositoriesListActionsProps> = ({
  repository,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { viewAction, actions, destructiveActions } = useGetRepositoryActions({
    repository,
    openModal,
  });

  return (
    <>
      <ListActions
        toggleAriaLabel={`${repository.display_name} actions`}
        actions={[viewAction, ...actions]}
        destructiveActions={destructiveActions}
      />

      {isModalOpen && 
        <RemoveLocalRepositoryModal
          close={closeModal}
          repository={repository}
        />
      }
    </>
  );
};

export default LocalRepositoriesListActions;
