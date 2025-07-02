import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import type { ListAction } from "@/components/layout/ListActions";
import ListActions from "@/components/layout/ListActions";
import { ROOT_PATH } from "@/constants";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
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
  const { removeInstancesQuery, sanitizeInstanceQuery } = useInstances();

  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;

  const { mutateAsync: sanitizeInstanceMutation, isPending: isSanitizing } =
    sanitizeInstanceQuery;

  const handleCloseModal = () => {
    setSelectedAction("");
  };

  const handleSanitizeInstance = async () => {
    try {
      const { data: sanitizeActivity } = await sanitizeInstanceMutation({
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

  const handleRemoveInstances = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });

      notify.success({
        title: `You have successfully removed ${instance.title}`,
        message: `${instance.title} has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const actions: ListAction[] = [
    {
      icon: "machines",
      label: "View details",
      "aria-label": `View ${instance.title} instance details`,
      onClick: async () => navigate(`${ROOT_PATH}instances/${instance.id}`),
    },
  ];

  const destructiveActions: ListAction[] = [
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
      "aria-label": `Remove from Landscape`,
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
      <TextConfirmationModal
        isOpen={selectedAction === "remove"}
        title={`Remove ${instance.title} instance`}
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        onConfirm={handleRemoveInstances}
        close={handleCloseModal}
        confirmationText={`remove ${instance.title}`}
      >
        <p>
          Removing this {instance.title} will delete all associated data and
          free up one license slot for another computer to be registered.
        </p>
      </TextConfirmationModal>
      <TextConfirmationModal
        isOpen={selectedAction === "sanitize"}
        title={`Sanitize "${instance.title}" instance`}
        confirmButtonLabel="Sanitize"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isSanitizing}
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
