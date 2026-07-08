import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import RemovePublicationModal from "../RemovePublicationModal";
import RepublishPublicationModal from "../RepublishPublicationModal";
import type { Publication } from "@canonical/landscape-openapi";
import { useOperation } from "@/features/operations";

interface PublicationsListActionsProps {
  readonly publication: Publication;
}

const PublicationsListActions: FC<PublicationsListActionsProps> = ({
  publication,
}) => {
  const { createPageParamsSetter } = usePageParams();
  const { isOperationInProgress } = useOperation();
  const isPublishing = isOperationInProgress(publication.lastOperation);
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
      "aria-label": `View details of "${publicationDisplayName}"`,
      onClick: createPageParamsSetter({
        sidePath: ["view"],
        name: publication.publicationId,
      }),
    },
    isPublishing
      ? {
          icon: "spinner u-animation--spin",
          label: "Publishing",
          "aria-label": `Publishing "${publicationDisplayName}"`,
          disabled: true,
        }
      : {
          icon: "upload",
          label: "Republish",
          "aria-label": `Republish "${publicationDisplayName}"`,
          onClick: openRepublishModal,
        },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${publicationDisplayName}"`,
      onClick: openRemovalModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${publicationDisplayName} publication actions`}
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
