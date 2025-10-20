import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import { createPortal } from "react-dom";
import useDetachToken from "../../api/useDetachToken";

interface DetachTokenModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly computerIds: number[];
  readonly instanceTitle?: string;
  readonly instanceCount?: number;
}

const DetachTokenModal: FC<DetachTokenModalProps> = ({
  isOpen,
  onClose,
  computerIds,
  instanceTitle,
  instanceCount,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { openActivityDetails } = useActivities();
  const { detachToken, isDetachingToken } = useDetachToken();

  const count = instanceCount ?? computerIds.length;
  const isMultiple = count > 1;

  const handleDetachToken = async () => {
    try {
      const { data: detachActivity } = await detachToken({
        computer_ids: computerIds,
      });

      const title = instanceTitle
        ? `You queued detachment of Ubuntu Pro token for instance ${instanceTitle}.`
        : `You queued detachment of Ubuntu Pro token for ${count} ${pluralize(count, "instance")}.`;

      const message = isMultiple
        ? `This will disconnect the ${pluralize(count, "instance from its", "instances from their")} subscription and pause any enabled Pro services.`
        : "This will disconnect the instance from its subscription and pause any enabled Pro services.";

      notify.success({
        title,
        message,
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(detachActivity);
            },
          },
        ],
      });

      onClose();
    } catch (error) {
      debug(error);
    } finally {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalMessage = isMultiple ? (
    <p>
      Detaching the Ubuntu Pro token will disconnect {count}{" "}
      {pluralize(count, "instance from its ", "instances from their ")}
      subscription and pause any enabled Pro services.
    </p>
  ) : (
    <p>
      Detaching the Ubuntu Pro token will disconnect this instance from its
      subscription and pause any enabled Pro services.
    </p>
  );

  return createPortal(
    <TextConfirmationModal
      isOpen={isOpen}
      title="Detach Ubuntu Pro token"
      onConfirm={handleDetachToken}
      close={onClose}
      confirmButtonLabel="Detach"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isDetachingToken}
      confirmButtonDisabled={isDetachingToken}
      confirmationText="detach ubuntu pro token"
    >
      {modalMessage}
    </TextConfirmationModal>,
    document.body,
  );
};

export default DetachTokenModal;
