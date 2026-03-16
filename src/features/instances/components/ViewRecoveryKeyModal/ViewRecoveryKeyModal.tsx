import LoadingState from "@/components/layout/LoadingState";
import type { Instance } from "@/types/Instance";
import {
  ConfirmationModal,
  Notification,
  PasswordToggle,
} from "@canonical/react-components";
import { type FC, type ReactNode } from "react";
import useGetRecoveryKey from "../../api/useGetRecoveryKey";
import {
  getRecoveryKeyRegenerationAttemptMessage,
  isRecoveryKeyActivityInProgress,
} from "../../helpers";

interface ViewRecoveryKeyModalProps {
  readonly instance: Instance;
  readonly onClose: () => void;
}

const ViewRecoveryKeyModal: FC<ViewRecoveryKeyModalProps> = ({
  instance,
  onClose,
}) => {
  const { recoveryKey, recoveryKeyActivityStatus, isGettingRecoveryKey } =
    useGetRecoveryKey(instance.id);

  const isRecoveryKeyGenerationActivityInProgress =
    isRecoveryKeyActivityInProgress(recoveryKeyActivityStatus);
  const recoveryKeyRegenerationAttemptMessage =
    getRecoveryKeyRegenerationAttemptMessage(
      recoveryKey,
      recoveryKeyActivityStatus,
    );

  const getRecoveryKeyContent = (): ReactNode => {
    if (isGettingRecoveryKey) {
      return <LoadingState />;
    }

    return (
      <>
        {isRecoveryKeyGenerationActivityInProgress && (
          <p>
            A recovery key generation activity is in progress. You can still
            view the current key until the activity completes.
          </p>
        )}
        <PasswordToggle
          id={`recovery-key-${instance.id}`}
          label="Recovery key"
          value={recoveryKey ?? ""}
        />
      </>
    );
  };

  return (
    <ConfirmationModal
      close={onClose}
      title={`View recovery key for "${instance.title}"`}
      confirmButtonLabel="Done"
      confirmButtonAppearance="positive"
      onConfirm={onClose}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <p>
        This key allows you to unlock and access encrypted data on instance if
        the primary encryption passphrase is unavailable or forgotten. Share it
        only through a secure method.
      </p>
      {recoveryKeyRegenerationAttemptMessage && (
        <Notification severity="caution" title="Warning:" inline>
          <span>{recoveryKeyRegenerationAttemptMessage}</span>
        </Notification>
      )}
      {getRecoveryKeyContent()}
    </ConfirmationModal>
  );
};

export default ViewRecoveryKeyModal;
