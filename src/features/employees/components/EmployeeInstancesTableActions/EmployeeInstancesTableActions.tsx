import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import { useActivities } from "@/features/activities";
import {
  InstanceRemoveFromLandscapeModal,
  useSanitizeInstance,
} from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Action } from "@/types/Action";
import type { Instance } from "@/types/Instance";
import { ICONS } from "@canonical/react-components";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";

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

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View ${instance.title} instance details`,
      onClick: async () => navigate(`instances/${instance.id}`),
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "tidy",
      label: "Sanitize",
      "aria-label": `Sanitize ${instance.title} instance`,
      onClick: () => {
        setSelectedAction("sanitize");
      },
    },
    {
      icon: ICONS.delete,
      label: "Remove from Landscape",
      "aria-label": `Remove ${instance.title} from Landscape`,
      onClick: () => {
        setSelectedAction("remove");
      },
    },
  ];

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
    </>
  );
};

export default EmployeeInstancesTableActions;
