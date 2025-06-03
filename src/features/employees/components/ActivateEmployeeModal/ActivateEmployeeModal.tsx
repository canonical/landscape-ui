import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import type { Employee } from "../../types";
import { usePatchEmployee } from "../../api";
import useDebug from "@/hooks/useDebug";

interface ActivateEmployeeModalProps {
  readonly employee: Employee;
  readonly handleClose: () => void;
}

const ActivateEmployeeModal: FC<ActivateEmployeeModalProps> = ({
  employee,
  handleClose,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { patchEmployee, isPending } = usePatchEmployee();

  const handleActivateEmployee = async () => {
    try {
      await patchEmployee({
        id: employee.id,
        is_active: true,
      });
      notify.success({
        title: `You have successfully activated ${employee.name}`,
        message: `${employee.name} will be able to log in to Landscape and register new instances with their account.`,
      });
      handleClose();
    } catch (error) {
      debug(error);
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
    >
      <p>
        This will allow {employee.name} to log in to Landscape and register new
        instances with their account.
      </p>
    </ConfirmationModal>
  );
};

export default ActivateEmployeeModal;
