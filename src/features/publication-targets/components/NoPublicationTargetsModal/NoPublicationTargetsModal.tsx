import type { FC } from "react";
import { ConfirmationModal } from "@canonical/react-components";
import { useNavigate } from "react-router";
import { ROUTES } from "@/libs/routes";

interface NoPublicationTargetsModalProps {
  readonly close: () => void;
}

const NoPublicationTargetsModal: FC<NoPublicationTargetsModalProps> = ({
  close,
}) => {
  const navigate = useNavigate();

  return (
    <ConfirmationModal
      title="No publication targets have been added"
      confirmButtonLabel="Add publication target"
      confirmButtonAppearance="positive"
      onConfirm={() =>
        navigate(ROUTES.repositories.publicationTargets({ sidePath: ["add"] }))
      }
      close={close}
      renderInPortal
    >
      <p>
        In order to publish a mirror or a local repository you must first add a
        publication target to indicate the location you wish to publish that
        mirror to.
      </p>
    </ConfirmationModal>
  );
};

export default NoPublicationTargetsModal;
