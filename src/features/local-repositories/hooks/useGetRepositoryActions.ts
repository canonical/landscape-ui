import usePageParams from "@/hooks/usePageParams";
import type { LocalRepository } from "../types";
import type { Action } from "@/types/Action";

interface UseGetRepositoryActionsProps {
  readonly repository: LocalRepository;
  readonly openModal: () => void;
}

export const useGetRepositoryActions = ({
  repository,
  openModal,
}: UseGetRepositoryActionsProps) => {
  const { sidePath, createSidePathPusher, createPageParamsSetter } =
    usePageParams();

  const openSidePanel = (action: string) => {
    if (!sidePath.length) {
      return createPageParamsSetter({
        sidePath: [action],
        repository: repository.local_id,
      });
    }
    return createSidePathPusher(action);
  };

  const viewAction: Action = {
    icon: "show",
    label: "View details",
    "aria-label": `View details of "${repository.display_name}" repository`,
    onClick: openSidePanel("view"),
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${repository.display_name}" repository`,
      onClick: openSidePanel("edit"),
    },
    {
      icon: "import",
      label: "Import packages",
      "aria-label": `Import packages to "${repository.display_name}" repository`,
      onClick: openSidePanel("import-packages"),
    },
    {
      icon: "upload",
      label: "Publish",
      "aria-label": `Publish "${repository.display_name}" repository`,
      onClick: openSidePanel("publish"),
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${repository.display_name}" repository`,
      onClick: openModal,
    },
  ];

  return {
    viewAction,
    actions,
    destructiveActions,
  };
};
