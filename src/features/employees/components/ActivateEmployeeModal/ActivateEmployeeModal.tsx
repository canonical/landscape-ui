import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import type { Employee } from "../../types";
import { usePatchEmployee } from "../../api";
import { API_URL } from "@/constants";
import axios from "axios";

interface ActivateEmployeeModalProps {
  readonly employee: Employee;
  readonly handleClose: () => void;
}

const ActivateEmployeeModal: FC<ActivateEmployeeModalProps> = ({
  employee,
  handleClose,
}) => {
  const { notify } = useNotify();
  const { patchEmployee, isPending } = usePatchEmployee();

  const handleActivateEmployee = async () => {
    try {
      await patchEmployee({
        id: employee.id,
        is_active: true,
      });
      await axios.post(`${API_URL}employees/${employee.id}/welcome-email`);
      notify.success({
        title: `You have successfully activated ${employee.name}`,
        message: `${employee.name} will be able to log in to Landscape and register new instances with their account.`,
        actions: [
          {
            label: "View employees",
            onClick: () => {
              window.location.assign("/portal/settings/employees");
            },
          },
        ],
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmationModal
      confirmButtonLabel="Activate"
      onConfirm={handleActivateEmployee}
      confirmButtonAppearance="positive"
      title={`Activate ${employee.name}`}
      close={handleClose}
      confirmButtonDisabled={isPending}
      confirmButtonLoading={isPending}
      renderInPortal
    >
      <p className="u-margin--bottom">
        This will allow {employee.name} to log in to Landscape and register new
        instances with their account.
      </p>
    </ConfirmationModal>
  );
};

export default ActivateEmployeeModal;
