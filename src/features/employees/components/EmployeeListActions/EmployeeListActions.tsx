import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import type { Employee } from "../../types";
import ActivateEmployeeModal from "../ActivateEmployeeModal";
import DeactivateEmployeeModal from "../DeactivateEmployeeModal";

const EmployeeDetails = lazy(async () => import("../EmployeeDetails"));

interface EmployeeDetailsActionsProps {
  readonly employee: Employee;
}

const EmployeeListActions: FC<EmployeeDetailsActionsProps> = ({ employee }) => {
  const { setSidePanelContent } = useSidePanel();

  const {
    value: isActivateModalOpen,
    setTrue: openActivateModal,
    setFalse: closeActivateModal,
  } = useBoolean();

  const {
    value: isDeactivateModalOpen,
    setTrue: openDeactivateModal,
    setFalse: closeDeactivateModal,
  } = useBoolean();

  const handleViewDetails = () => {
    setSidePanelContent(
      "Employee details",
      <Suspense fallback={<LoadingState />}>
        <EmployeeDetails employee={employee} />
      </Suspense>,
      "medium",
    );
  };

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View ${employee.name} employee details`,
      onClick: handleViewDetails,
    },
  ];

  const destructiveActions: Action[] = [];

  if (employee.is_active) {
    destructiveActions.push({
      icon: "pause",
      label: "Deactivate",
      "aria-label": `Deactivate ${employee.name}`,
      onClick: openDeactivateModal,
    });
  } else {
    actions.push({
      icon: "play",
      label: "Activate",
      "aria-label": `Activate ${employee.name}`,
      onClick: openActivateModal,
    });
  }

  return (
    <>
      <ListActions
        toggleAriaLabel={`${employee.name} actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      {isActivateModalOpen && (
        <ActivateEmployeeModal
          employee={employee}
          handleClose={closeActivateModal}
        />
      )}

      {isDeactivateModalOpen && (
        <DeactivateEmployeeModal
          employee={employee}
          handleClose={closeDeactivateModal}
        />
      )}
    </>
  );
};

export default EmployeeListActions;
