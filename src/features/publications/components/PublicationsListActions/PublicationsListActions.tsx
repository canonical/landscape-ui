import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/SidePanel/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { Action } from "@/types/Action";
import { lazy, Suspense, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { Publication } from "../../types";
import RemovePublicationModal from "../RemovePublicationModal";
import RepublishPublicationModal from "../RepublishPublicationModal";

const PublicationDetails = lazy(() => import("../PublicationDetails"));

interface PublicationsListActionsProps {
  readonly publication: Publication;
}

const PublicationsListActions: FC<PublicationsListActionsProps> = ({
  publication,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const publicationLabel = publication.label;

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
      publication.label,
      <Suspense fallback={<LoadingState />}>
        <PublicationDetails publication={publication} />
      </Suspense>,
    );
  };

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View details of "${publicationLabel}" publication`,
      onClick: handlePublicationDetails,
    },
    {
      icon: "upload",
      label: "Republish",
      "aria-label": `Republish "${publicationLabel}" publication`,
      onClick: openRepublishModal,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${publicationLabel}" publication`,
      onClick: openRemovalModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${publicationLabel} actions`}
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
