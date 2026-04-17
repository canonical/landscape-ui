import type { FC } from "react";
import type { LocalRepository } from "../../types";
import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import { useBoolean } from "usehooks-ts";
import RemoveLocalRepositoryModal from "../RemoveLocalRepositoryModal";

interface LocalRepositoriesListActionsProps {
  readonly repository: LocalRepository;
}

const LocalRepositoriesListActions: FC<LocalRepositoriesListActionsProps> = ({ repository }) => {
  const { createPageParamsSetter } = usePageParams();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemovalModal,
    setFalse: closeRemovalModal,
  } = useBoolean();

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View details of "${repository.name}" repository`,
      onClick: createPageParamsSetter({ sidePath: ["view"], repository: repository.name }),
    },
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${repository.name}" repository`,
      onClick: createPageParamsSetter({ sidePath: ["edit"], repository: repository.name }),
    },
    {
      icon: "edit",
      label: "Edit packages",
      "aria-label": `Edit packages for "${repository.name}" repository`,
      onClick: createPageParamsSetter({ sidePath: ["edit-packages"], repository: repository.name }),
    },
    {
      icon: "upload",
      label: "Publish",
      "aria-label": `Publish "${repository.name}" repository`,
      onClick: createPageParamsSetter({ sidePath: ["publish"], repository: repository.name }),
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${repository.name}" repository`,
      onClick: openRemovalModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${repository.name} actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <RemoveLocalRepositoryModal
        isOpen={isRemoveModalOpen}
        close={closeRemovalModal}
        repository={repository}
      />
    </>
  );
};

export default LocalRepositoriesListActions;
