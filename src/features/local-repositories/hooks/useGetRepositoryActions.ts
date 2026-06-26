import usePageParams from "@/hooks/usePageParams";
import type { Local } from "@canonical/landscape-openapi";
import type { Action } from "@/types/Action";

interface UseGetRepositoryActionsProps {
  readonly repository: Local;
  readonly openRemovalModal: () => void;
  readonly openPublishGuard: () => void;
  readonly isImporting: boolean;
}

export const useGetRepositoryActions = ({
  repository,
  isImporting,
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
    onClick: openSidePanel("view"),
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      onClick: openSidePanel("edit"),
    },
    isImporting
      ? {
          icon: "spinner u-animation--spin",
          label: "Importing packages",
          disabled: true,
          tooltipMessage:
            "You must wait for this action to be completed to import more packages.",
        }
      : {
          icon: "import",
          label: "Import packages",
          onClick: openSidePanel("import-packages"),
        },
    {
      icon: "upload",
      label: "Publish",
      onClick: openPublishGuard,
    },
  ];

  const destructiveAction: Action = {
    icon: "delete",
    label: "Remove",
    className: "u-text--negative",
    onClick: openRemovalModal,
    appearance: "negative",
  };

  return {
    viewAction,
    actions,
    destructiveAction,
  };
};
