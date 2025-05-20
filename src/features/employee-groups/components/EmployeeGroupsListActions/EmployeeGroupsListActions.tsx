import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { ConfirmationModal, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemoveEmployeeGroupsModal } from "../../hooks";
import type { EmployeeGroup } from "../../types";

const AssignAutoInstallFileForm = lazy(
  async () => import("../AssignAutoInstallFileForm"),
);

const EditEmployeeGroupPriorityForm = lazy(
  async () => import("../EditEmployeeGroupPriorityForm"),
);

interface EmployeeDetailsActionsProps {
  readonly employeeGroup: EmployeeGroup;
}

const EmployeeGroupsListActions: FC<EmployeeDetailsActionsProps> = ({
  employeeGroup,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const {
    body,
    confirmButtonAppearance,
    confirmButtonLabel,
    deleteEmployeeGroups,
    isLoading,
    title,
  } = useRemoveEmployeeGroupsModal({
    selectedEmployeeGroups: [employeeGroup],
    onSuccess: closeModal,
  });

  const handleAssignAutoinstallFile = () => {
    setSidePanelContent(
      `Reassign autoinstall file to ${employeeGroup.name}`,
      <Suspense fallback={<LoadingState />}>
        <AssignAutoInstallFileForm employeeGroups={[employeeGroup]} />
      </Suspense>,
    );
  };

  const handleEditPriority = () => {
    setSidePanelContent(
      `Edit priority for ${employeeGroup.name} group`,
      <Suspense fallback={<LoadingState />}>
        <EditEmployeeGroupPriorityForm group={employeeGroup} />
      </Suspense>,
    );
  };

  const actions = [
    {
      icon: "sort-both",
      label: "Edit priority",
      "aria-label": `Edit priority for ${employeeGroup.name} employee group`,
      onClick: handleEditPriority,
    },
    {
      icon: "file",
      label: "Reassign autoinstall file",
      "aria-label": `Assign an autoinstall file to ${employeeGroup.name} employee group`,
      onClick: handleAssignAutoinstallFile,
    },
  ];

  const destructiveActions = [
    {
      icon: ICONS.delete,
      label: "Remove",
      "aria-label": `Remove ${employeeGroup.name} employee group`,
      onClick: openModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${employeeGroup.name} actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      {isModalOpen && (
        <ConfirmationModal
          title={title}
          confirmButtonLabel={confirmButtonLabel}
          confirmButtonAppearance={confirmButtonAppearance}
          confirmButtonDisabled={isLoading}
          confirmButtonLoading={isLoading}
          onConfirm={deleteEmployeeGroups}
          close={closeModal}
        >
          {body}
        </ConfirmationModal>
      )}
    </>
  );
};

export default EmployeeGroupsListActions;
