import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import RemoveTargetForm from "../RemoveTargetForm";
import type { PublicationTarget } from "@canonical/landscape-openapi";

interface PublicationTargetListActionsProps {
  readonly target: PublicationTarget;
}

const PublicationTargetListActions: FC<PublicationTargetListActionsProps> = ({
  target,
}) => {
  const { createPageParamsSetter } = usePageParams();
  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleViewTargetDetails = createPageParamsSetter({
    sidePath: ["view"],
    name: target.publicationTargetId ?? "",
  });

  const handleEditTarget = createPageParamsSetter({
    sidePath: ["edit"],
    name: target.publicationTargetId ?? "",
  });

  const handleRemoveTarget = (): void => {
    openRemoveModal();
  };

  const nondestructiveActions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View details for ${target.displayName}`,
      onClick: handleViewTargetDetails,
    },
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${target.displayName}`,
      onClick: handleEditTarget,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${target.displayName}`,
      onClick: handleRemoveTarget,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${target.displayName} actions`}
        actions={nondestructiveActions}
        destructiveActions={destructiveActions}
      />

      <RemoveTargetForm
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        target={target}
      />
    </>
  );
};

export default PublicationTargetListActions;
