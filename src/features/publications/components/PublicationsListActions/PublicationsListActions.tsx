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
}

const PublicationsListActions: FC<PublicationsListActionsProps> = ({
  publication,
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
      "aria-label": `View details of "${publicationDisplayName}" publication`,
      onClick: createPageParamsSetter({
        sidePath: ["view"],
        name: publication.publicationId,
      }),
    },
    {
      icon: "upload",
      label: "Republish",
      "aria-label": `Republish "${publicationDisplayName}" publication`,
      onClick: openRepublishModal,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${publicationDisplayName}" publication`,
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
