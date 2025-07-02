import { Button, Icon } from "@canonical/react-components";
import { useState, type FC } from "react";
import type { Employee } from "../../types";
import EmployeeActivationStatusModal from "../EmployeeActivationStatusModal";
import useSidePanel from "@/hooks/useSidePanel";

interface EmployeeDetailsHeaderProps {
  readonly employee: Employee;
}

const EmployeeDetailsHeader: FC<EmployeeDetailsHeaderProps> = ({
  employee,
}) => {
  const [open, setOpen] = useState(false);
  const { closeSidePanel } = useSidePanel();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    closeSidePanel();
  };

  return (
    <div>
      <Button hasIcon onClick={handleOpen}>
        <Icon name={employee.is_active ? "pause" : "play"} />
        <span>{employee.is_active ? "Deactivate" : "Activate"}</span>
      </Button>
      {open && (
        <EmployeeActivationStatusModal
          employee={employee}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default EmployeeDetailsHeader;
