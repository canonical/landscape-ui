import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import type { PublicationTargetWithPublications } from "../../types";
import TargetDetails from "../TargetDetails";

const EditTargetForm = lazy(async () => import("../EditTargetForm/EditTargetForm"));
const RemoveTargetForm = lazy(async () => import("../RemoveTargetForm/RemoveTargetForm"));

interface PublicationTargetListActionsProps {
  readonly target: PublicationTargetWithPublications;
}

const PublicationTargetListActions: FC<PublicationTargetListActionsProps> = ({ target }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleViewTargetDetails = () => {
    setSidePanelContent(
      target.display_name ?? target.name,
      <TargetDetails target={target} />,
    );
  };

  const handleEditTarget = (): void => {
    setSidePanelContent(
      `Edit "${target.display_name ?? target.name}"`,
      <Suspense fallback={<LoadingState />}>
        <EditTargetForm target={target} />
      </Suspense>,
    );
  };

  const handleRemoveTarget = (): void => {
    setSidePanelContent(
      `Remove "${target.display_name ?? target.name}"`,
      <Suspense fallback={<LoadingState />}>
        <RemoveTargetForm target={target} />
      </Suspense>,
    );
  };

  const nondestructiveActions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View details for ${target.display_name}`,
      onClick: handleViewTargetDetails,
    },
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${target.display_name}`,
      onClick: handleEditTarget,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${target.display_name}`,
      onClick: handleRemoveTarget,
    },
  ];

  return (
    <ListActions
      toggleAriaLabel={`${target.display_name} actions`}
      actions={nondestructiveActions}
      destructiveActions={destructiveActions}
    />
  );
};

export default PublicationTargetListActions;

