import usePageParams from "@/hooks/usePageParams";
import type { Local } from "@canonical/landscape-openapi";
import type { Action } from "@/types/Action";
import { useCanCancelOperations } from "@/features/operations";

interface UseGetRepositoryActionsProps {
  readonly repository: Local;
  readonly openRemovalModal: () => void;
  readonly openCancelImportModal: () => void;
  readonly openPublishGuard: () => void;
  readonly isImporting: boolean;
}

export const useGetRepositoryActions = ({
  repository,
  isImporting,
  openRemovalModal,
  openCancelImportModal,
  openPublishGuard,
}: UseGetRepositoryActionsProps) => {
  const { sidePath, createSidePathPusher, createPageParamsSetter } =
    usePageParams();
  const canCancelOperations = useCanCancelOperations();

  const openSidePanel = (action: string) => {
    if (!sidePath.length) {
      return createPageParamsSetter({
        sidePath: [action],
        name: repository.localId,
      });
    }
    return createSidePathPusher(action);
  };

  const importingButton = canCancelOperations
    ? {
        icon: "import",
        label: "Import packages",
        onClick: openCancelImportModal,
      }
    : {
        icon: "spinner u-animation--spin",
        label: "Importing packages",
        disabled: true,
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
      ? importingButton
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
