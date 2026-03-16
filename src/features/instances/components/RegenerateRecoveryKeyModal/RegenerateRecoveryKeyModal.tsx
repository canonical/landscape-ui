import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Instance } from "@/types/Instance";
import { type FC, type ReactNode } from "react";
import { isRecoveryKeyActivityInProgress } from "../../helpers";
import useGenerateRecoveryKey from "../../api/useGenerateRecoveryKey";
import useGetRecoveryKey from "../../api/useGetRecoveryKey";

interface RegenerateRecoveryKeyModalProps {
  readonly instance: Instance;
  readonly onClose: () => void;
}

const RegenerateRecoveryKeyModal: FC<RegenerateRecoveryKeyModalProps> = ({
  instance,
  onClose,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { openActivityDetails } = useActivities();

  const { generateRecoveryKey, isGeneratingRecoveryKey } =
    useGenerateRecoveryKey();
  const { recoveryKeyActivityStatus, isGettingRecoveryKey } = useGetRecoveryKey(
    instance.id,
  );
  const isRecoveryKeyGenerationActivityInProgress =
    isRecoveryKeyActivityInProgress(recoveryKeyActivityStatus);

  const handleRegenerateRecoveryKey = async () => {
    try {
      const { data: recoveryKeyActivityResult } = await generateRecoveryKey({
        computer_id: instance.id,
        force: isRecoveryKeyGenerationActivityInProgress,
      });

      notify.success({
        title: `You have successfully queued recovery key generation for ${instance.title}`,
        message:
          "Recovery key generation has been queued in Activities. You won’t be able to view the key until the activity completes.",
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(recoveryKeyActivityResult);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    } finally {
      onClose();
    }
  };

  const getRecoveryKeyContent = (): ReactNode => {
    if (isRecoveryKeyGenerationActivityInProgress) {
      return (
        <p>
          A recovery key generation activity is currently in progress. If you
          proceed, a new activity will be queued for this instance.
        </p>
      );
    }

    return (
      <p>
        Regenerating the recovery key will make the existing key unavailable
        until the new key is generated. You won’t be able to view the key
        immediately after requesting regeneration.
      </p>
    );
  };

  return (
    <TextConfirmationModal
      isOpen={true}
      confirmationText="regenerate recovery key"
      close={onClose}
      title={`Regenerate recovery key for "${instance.title}"`}
      confirmButtonLabel="Regenerate recovery key"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={isGeneratingRecoveryKey || isGettingRecoveryKey}
      confirmButtonLoading={isGeneratingRecoveryKey}
      onConfirm={handleRegenerateRecoveryKey}
    >
      {getRecoveryKeyContent()}
    </TextConfirmationModal>
  );
};

export default RegenerateRecoveryKeyModal;
