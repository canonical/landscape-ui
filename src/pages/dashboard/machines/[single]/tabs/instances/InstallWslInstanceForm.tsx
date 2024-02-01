import { FC } from "react";
import useDebug from "../../../../../../hooks/useDebug";
import { useWsl } from "../../../../../../hooks/useWsl";
import { Form, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import SidePanelFormButtons from "../../../../../../components/form/SidePanelFormButtons";

interface InstallWslInstanceFormProps {
  parentId: number;
}

const InstallWslInstanceForm: FC<InstallWslInstanceFormProps> = ({
  parentId,
}) => {
  const debug = useDebug();
  const { createChildComputerQuery } = useWsl();

  const { mutateAsync: createChildComputer } = createChildComputerQuery;

  const formik = useFormik({
    initialValues: { instanceType: "Ubuntu" },
    validationSchema: Yup.object({
      instanceType: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        await createChildComputer({
          parent_id: parentId,
          computer_name: values.instanceType,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="Instance type"
        required
        options={[
          { label: "Ubuntu", value: "Ubuntu" },
          { label: "Ubuntu-22.04", value: "Ubuntu-22.04" },
        ]}
        {...formik.getFieldProps("instanceType")}
        error={formik.touched.instanceType && formik.errors.instanceType}
      />

      <SidePanelFormButtons
        disabled={formik.isSubmitting}
        submitButtonText="Install"
        submitButtonAriaLabel="Install new WSL instance"
      />
    </Form>
  );
};

export default InstallWslInstanceForm;
