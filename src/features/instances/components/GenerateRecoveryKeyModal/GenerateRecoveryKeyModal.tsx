import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Instance } from "@/types/Instance";
import { ConfirmationModal } from "@canonical/react-components";
import { type FC } from "react";
import useGenerateRecoveryKey from "../../api/useGenerateRecoveryKey";

interface GenerateRecoveryKeyModalProps {
  readonly instance: Instance;
  readonly onClose: () => void;
}

const GenerateRecoveryKeyModal: FC<GenerateRecoveryKeyModalProps> = ({
  instance,
  onClose,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { openActivityDetails } = useActivities();

  const { generateRecoveryKey, isGeneratingRecoveryKey } =
    useGenerateRecoveryKey();

  const handleGenerateRecoveryKey = async () => {
    try {
      const { data: recoveryKeyActivityResult } = await generateRecoveryKey({
        computer_id: instance.id,
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

  return (
    <ConfirmationModal
      close={onClose}
      title={`Generate recovery key for "${instance.title}"`}
      confirmButtonLabel="Generate recovery key"
      confirmButtonAppearance="positive"
      confirmButtonDisabled={isGeneratingRecoveryKey}
      confirmButtonLoading={isGeneratingRecoveryKey}
      onConfirm={handleGenerateRecoveryKey}
    >
      <p>
        This key allows you to unlock and access encrypted data on instance if
        the primary encryption passphrase is unavailable or forgotten. Share it
        only through a secure method. You won’t be able to view the key until
        the activity completes.
      </p>
    </ConfirmationModal>
  );
};

export default GenerateRecoveryKeyModal;
