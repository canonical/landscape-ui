import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import RemovePublicationModal from "../RemovePublicationModal";
import RepublishPublicationModal from "../RepublishPublicationModal";
import type { Publication } from "@canonical/landscape-openapi";

interface PublicationsListActionsProps {
  readonly publication: Publication;
  readonly inProgress: boolean;
}

const PublicationsListActions: FC<PublicationsListActionsProps> = ({
  publication,
  inProgress,
}) => {
  const { createPageParamsSetter } = usePageParams();
  const publicationDisplayName = publication.displayName;

  const {
    value: isRemoveModalOpen,
    setTrue: openRemovalModal,
    setFalse: closeRemovalModal,
  } = useBoolean();

  const {
    value: isRepublishModalOpen,
    setTrue: openRepublishModal,
    setFalse: closeRepublishModal,
  } = useBoolean();

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      onClick: createPageParamsSetter({
        sidePath: ["view"],
        name: publication.publicationId,
      }),
    },
    inProgress
      ? {
          icon: "spinner u-animation--spin",
          label: "Publishing",
          disabled: true,
          tooltipMessage: "You must wait for this action to be completed to republish it.",
        }
      : {
          icon: "upload",
          label: "Republish",
          onClick: openRepublishModal,
        },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      onClick: openRemovalModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${publicationDisplayName} actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <RepublishPublicationModal
        isOpen={isRepublishModalOpen}
        close={closeRepublishModal}
        publication={publication}
      />

      <RemovePublicationModal
        isOpen={isRemoveModalOpen}
        close={closeRemovalModal}
        publication={publication}
      />
    </>
  );
};

export default PublicationsListActions;
