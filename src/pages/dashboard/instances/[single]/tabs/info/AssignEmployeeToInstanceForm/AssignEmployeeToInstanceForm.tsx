import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import {
  EmployeeDropdown,
  useAssociateEmployeeWithInstance,
} from "@/features/employees";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useParams } from "react-router";
import type { FormProps } from "./types";
import * as Yup from "yup";
import { getFormikError } from "@/utils/formikErrors";

interface AssignEmployeeToInstanceFormProps {
  readonly instanceTitle: string;
}

const AssignEmployeeToInstanceForm: FC<AssignEmployeeToInstanceFormProps> = ({
  instanceTitle,
}) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { associateEmployeeWithInstance, isAssociating } =
    useAssociateEmployeeWithInstance();

  const handleSubmit = async (values: FormProps) => {
    if (!values.employee) {
      return;
    }

    try {
      await associateEmployeeWithInstance({
        computer_id: instanceId,
        employee_id: values.employee.id,
      });

      closeSidePanel();

      notify.success({
        title: `You have successfully associated ${values.employee.name}`,
        message: `${values.employee.name} has been successfully associated with ${instanceTitle}.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormProps>({
    initialValues: {
      employee: null,
    },
    validationSchema: Yup.object().shape({
      employee: Yup.object()
        .shape({
          id: Yup.number().required(),
          name: Yup.string().required(),
        })
        .nullable()
        .required("This field is required."),
    }),
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <p>
        You can associate the instance with the selected employee, allowing them
        to view its details and recovery key.
      </p>

      <EmployeeDropdown
        employee={formik.values.employee}
        setEmployee={async (newEmployee) =>
          await formik.setFieldValue("employee", newEmployee)
        }
        error={getFormikError(formik, "employee")}
      />

      <SidePanelFormButtons
        submitButtonDisabled={isAssociating}
        submitButtonText="Associate"
        submitButtonAppearance="positive"
      />
    </Form>
  );
};

export default AssignEmployeeToInstanceForm;
