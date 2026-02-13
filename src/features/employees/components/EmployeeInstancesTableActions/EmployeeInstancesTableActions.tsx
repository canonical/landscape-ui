import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import { useActivities } from "@/features/activities";
import {
  GenerateRecoveryKeyModal,
  InstanceRemoveFromLandscapeModal,
  RegenerateRecoveryKeyModal,
  useGetRecoveryKey,
  useSanitizeInstance,
  ViewRecoveryKeyModal,
} from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ROUTES } from "@/libs/routes";
import type { Instance } from "@/types/Instance";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { getInstanceActions } from "./helpers";

interface EmployeeInstancesTableActionsProps {
  readonly instance: Instance;
}

const EmployeeInstancesTableActions: FC<EmployeeInstancesTableActionsProps> = ({
  instance,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>("");

  const debug = useDebug();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { openActivityDetails } = useActivities();

  const { sanitizeInstance, isSanitizingInstance } = useSanitizeInstance();
  const { recoveryKey, recoveryKeyActivity, isRecoveryKeyFetched } =
    useGetRecoveryKey(instance.id);
  const isRecoveryKeyActivityInProgress = Boolean(
    recoveryKeyActivity &&
    !["succeeded", "failed", "canceled"].includes(
      recoveryKeyActivity.activity_status,
    ),
  );
  const hasRecoveryKey = Boolean(recoveryKey);
  const shouldShowRecoveryKeyActions = isRecoveryKeyFetched;

  const handleCloseModal = () => {
    setSelectedAction("");
  };

  const handleSanitizeInstance = async () => {
    try {
      const { data: sanitizeActivity } = await sanitizeInstance({
        computer_id: instance.id,
        computer_title: instance.title,
      });

      notify.success({
        title: `You have successfully initiated Sanitization for ${instance.title}`,
        message: `Sanitizing for ${instance.title} has been queued in Activities. The data will be permanently irrecoverable once complete.`,
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(sanitizeActivity);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const { actions, destructiveActions } = getInstanceActions(
    {
      instance,
      handlers: {
        navigateDetails: () =>
          navigate(ROUTES.instances.details.single(instance.id)),
        viewRecoveryKey: () => {
          setSelectedAction("view-recovery-key");
        },
        generateRecoveryKey: () => {
          setSelectedAction("generate-recovery-key");
        },
        regenerateRecoveryKey: () => {
          setSelectedAction("regenerate-recovery-key");
        },
        sanitize: () => {
          setSelectedAction("sanitize");
        },
        remove: () => {
          setSelectedAction("remove");
        },
      },
    },
    {
      canViewKey: shouldShowRecoveryKeyActions && hasRecoveryKey,
      canGenKey:
        shouldShowRecoveryKeyActions &&
        !hasRecoveryKey &&
        !isRecoveryKeyActivityInProgress,
      canRegenKey:
        shouldShowRecoveryKeyActions &&
        (hasRecoveryKey || isRecoveryKeyActivityInProgress),
    },
  );

  return (
    <>
      <ListActions
        toggleAriaLabel={`${instance.title} profile actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <InstanceRemoveFromLandscapeModal
        close={handleCloseModal}
        instance={instance}
        isOpen={selectedAction === "remove"}
      />

      <TextConfirmationModal
        isOpen={selectedAction === "sanitize"}
        title={`Sanitize "${instance.title}" instance`}
        confirmButtonLabel="Sanitize"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isSanitizingInstance}
        onConfirm={handleSanitizeInstance}
        close={handleCloseModal}
        confirmationText={`sanitize ${instance.title}`}
      >
        <p>
          Sanitization will permanently delete the encryption keys for{" "}
          {instance.title}, making its data completely irrecoverable. This
          action cannot be undone. Please confirm your wish to proceed.
        </p>
      </TextConfirmationModal>

      {selectedAction === "view-recovery-key" && (
        <ViewRecoveryKeyModal instance={instance} onClose={handleCloseModal} />
      )}

      {selectedAction === "generate-recovery-key" && (
        <GenerateRecoveryKeyModal
          instance={instance}
          onClose={handleCloseModal}
        />
      )}

      {selectedAction === "regenerate-recovery-key" && (
        <RegenerateRecoveryKeyModal
          instance={instance}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default EmployeeInstancesTableActions;
