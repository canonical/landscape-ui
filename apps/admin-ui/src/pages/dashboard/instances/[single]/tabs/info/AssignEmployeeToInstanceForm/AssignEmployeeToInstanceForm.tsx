import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import type { Employee } from "@/features/employees";
import {
  EmployeeDropdown,
  useAssociateEmployeeWithInstance,
  useDisassociateEmployeeFromInstance,
  useGetEmployee,
} from "@/features/employees";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { Form, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useParams } from "react-router";
import type { FormProps } from "./types";
import { ACTION_OPTIONS } from "./constants";

interface AssignEmployeeToInstanceFormProps {
  readonly instanceTitle: string;
  readonly employeeId: number | null;
}

const AssignEmployeeToInstanceForm: FC<AssignEmployeeToInstanceFormProps> = ({
  instanceTitle,
  employeeId,
}) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { associateEmployeeWithInstance, isAssociating } =
    useAssociateEmployeeWithInstance();

  const { disassociateEmployeeFromInstance, isDisassociating } =
    useDisassociateEmployeeFromInstance();

  const { employee, isPending } = useGetEmployee(
    {
      id: employeeId || 0,
    },
    { enabled: !!employeeId },
  );

  const handleAssociateEmployee = async (newEmployee: Employee) => {
    try {
      await associateEmployeeWithInstance({
        computer_id: instanceId,
        employee_id: newEmployee.id,
      });

      closeSidePanel();

      notify.success({
        title: `You have successfully associated ${newEmployee.name}`,
        message: `${newEmployee.name} has been successfully associated with ${instanceTitle}.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleDisassociateEmployee = async (currentEmployee: Employee) => {
    try {
      await disassociateEmployeeFromInstance({
        computer_id: instanceId,
        employee_id: currentEmployee.id,
      });

      closeSidePanel();

      notify.success({
        title: `You have successfully disassociated ${currentEmployee.name}`,
        message: `${currentEmployee.name} has been successfully disassociated from ${instanceTitle}.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleSubmit = async (values: FormProps) => {
    if (!values.employee) {
      return;
    }

    if (values.action === "associate") {
      await handleAssociateEmployee(values.employee);
    } else {
      await handleDisassociateEmployee(values.employee);
    }
  };

  const formik = useFormik<FormProps>({
    initialValues: {
      action: "associate",
      employee: employee || null,
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const isSubmitDisabled =
    (!formik.values.employee && formik.values.action === "associate") ||
    isAssociating ||
    isDisassociating;

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Select
        label="Associate or disassociate an employee"
        labelClassName="u-off-screen"
        options={ACTION_OPTIONS}
        {...formik.getFieldProps("action")}
      />

      {formik.values.action === "associate" && (
        <EmployeeDropdown
          employee={formik.values.employee}
          setEmployee={async (newEmployee) =>
            await formik.setFieldValue("employee", newEmployee)
          }
          loadingExistingEmployee={employeeId ? isPending : false}
        />
      )}

      <SidePanelFormButtons
        submitButtonDisabled={isSubmitDisabled}
        submitButtonText={
          formik.values.action === "associate" ? "Associate" : "Disassociate"
        }
        submitButtonAppearance="positive"
      />
    </Form>
  );
};

export default AssignEmployeeToInstanceForm;
