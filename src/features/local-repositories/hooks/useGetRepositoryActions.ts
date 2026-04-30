import usePageParams from "@/hooks/usePageParams";
import type { Local } from "@canonical/landscape-openapi";
import type { Action } from "@/types/Action";

interface UseGetRepositoryActionsProps {
  readonly repository: Local;
  readonly openRemovalModal: () => void;
  readonly openPublishGuard: () => void;
}

export const useGetRepositoryActions = ({
  repository,
  openRemovalModal,
  openPublishGuard,
}: UseGetRepositoryActionsProps) => {
  const { sidePath, createSidePathPusher, createPageParamsSetter } =
    usePageParams();

  const openSidePanel = (action: string) => {
    if (!sidePath.length) {
      return createPageParamsSetter({
        sidePath: [action],
        name: repository.localId,
      });
    }
    return createSidePathPusher(action);
  };

  const viewAction: Action = {
    icon: "show",
    label: "View details",
    "aria-label": `View details of "${repository.displayName}" repository`,
    onClick: openSidePanel("view"),
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${repository.displayName}" repository`,
      onClick: openSidePanel("edit"),
    },
    {
      icon: "import",
      label: "Import packages",
      "aria-label": `Import packages to "${repository.displayName}" repository`,
      onClick: openSidePanel("import-packages"),
    },
    {
      icon: "upload",
      label: "Publish",
      "aria-label": `Publish "${repository.displayName}" repository`,
      onClick: openPublishGuard,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${repository.displayName}" repository`,
      onClick: openRemovalModal,
      appearance: "negative",
    },
  ];

  return {
    viewAction,
    actions,
    destructiveActions,
  };
};
