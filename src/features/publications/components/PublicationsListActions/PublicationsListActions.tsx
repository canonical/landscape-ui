import type { FC } from "react";
import type { Publication } from "../../types";
import ListActions from "@/components/layout/ListActions";
import useSidePanel from "@/hooks/useSidePanel";
import { useBoolean } from "usehooks-ts";
import type { Action } from "@/types/Action";
import PublicationDetails from "../PublicationDetails";
import RepublishPublicationModal from "../RepublishPublicationModal";
import RemovePublicationModal from "../RemovePublicationModal";

interface PublicationsListActionsProps {
  readonly publication: Publication;
}

const PublicationsListActions: FC<PublicationsListActionsProps> = ({
  publication,
}) => {
  const { setSidePanelContent } = useSidePanel();

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

  const handlePublicationDetails = () => {
    setSidePanelContent(
      publication.name,
      <PublicationDetails publication={publication} />,
    );
  };

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View details of "${publication.name}" publication`,
      onClick: handlePublicationDetails,
    },
    {
      icon: "upload",
      label: "Republish",
      "aria-label": `Republish "${publication.name}" publication`,
      onClick: openRepublishModal,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${publication.name}" publication`,
      onClick: openRemovalModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${publication.name} actions`}
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
