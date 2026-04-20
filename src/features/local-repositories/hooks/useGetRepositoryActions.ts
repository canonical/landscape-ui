import usePageParams from "@/hooks/usePageParams";
import type { LocalRepository } from "../types";
import type { Action } from "@/types/Action";

interface UseGetRepositoryActionsProps {
  readonly repository: LocalRepository;
  readonly openModal: () => void;
}

export const useGetRepositoryActions = ({ repository, openModal }: UseGetRepositoryActionsProps) => {
  const { createPageParamsSetter } = usePageParams();

  const viewAction: Action = {
      icon: "show",
      label: "View details",
      "aria-label": `View details of "${repository.name}" repository`,
      onClick: createPageParamsSetter({ sidePath: ["view"], repository: repository.name }),
    };

  const actions: Action[] = [
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
      onClick: openModal,
    },
  ];

  return {
    viewAction,
    actions,
    destructiveActions,
  };
};
