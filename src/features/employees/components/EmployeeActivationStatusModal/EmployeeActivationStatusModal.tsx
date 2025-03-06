import type { FC } from "react";
import type { Employee } from "../../types";
import ActivateEmployeeModal from "../ActivateEmployeeModal";
import DeactivateEmployeeModal from "../DeactivateEmployeeModal";

interface EmployeeActivationStatusModalProps {
  readonly employee: Employee;
  readonly handleClose: () => void;
}

const EmployeeActivationStatusModal: FC<EmployeeActivationStatusModalProps> = (
  props,
) => {
  return props.employee.is_active ? (
    <DeactivateEmployeeModal {...props} />
  ) : (
    <ActivateEmployeeModal {...props} />
  );
};

export default EmployeeActivationStatusModal;
