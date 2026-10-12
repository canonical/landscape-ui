import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import { ConfirmationModal } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import { useCancelOperation } from "@/features/operations";

interface RestartImportModalProps {
  readonly close: () => void;
  readonly isOpen: boolean;
  readonly repository: Local;
  readonly onContinue: () => void;
}

const RestartImportModal: FC<RestartImportModalProps> = ({
  close,
  isOpen,
  repository,
  onContinue,
}) => {
  const { cancelOperation, isCancelingOperation } = useCancelOperation();
  const debug = useDebug();

  if (!isOpen) {
    return null;
  }

  const cancelAndContinue = async () => {
    try {
      await cancelOperation(repository.lastOperation ?? "");

      onContinue();
      close();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <ConfirmationModal
      renderInPortal
      title={`${repository.displayName} is already importing packages`}
      confirmButtonLabel="Cancel import and continue"
      confirmButtonAppearance="positive"
      confirmButtonLoading={isCancelingOperation}
      onConfirm={cancelAndContinue}
      close={close}
    >
      <p className="u-margin--bottom">
        You already have an ongoing package import. You can only have one active
        import at a time.
        <br />
        <br />
        <strong>
          Before starting a new package import, you must cancel the current one.
        </strong>
      </p>
    </ConfirmationModal>
  );
};

export default RestartImportModal;
