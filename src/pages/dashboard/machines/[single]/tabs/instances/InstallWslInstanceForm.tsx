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

  const { mutateAsync } = createChildComputerQuery;

  const formik = useFormik({
    initialValues: { instanceType: "ubuntu" },
    validationSchema: Yup.object({
      instanceType: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values); // todo: use form values for actual submit

      try {
        await mutateAsync({
          parent_id: parentId,
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
        options={[
          { label: "Ubuntu", value: "ubuntu" },
          { label: "CentOS", value: "centos" },
          { label: "Windows", value: "windows" },
        ]}
        {...formik.getFieldProps("instanceType")}
        required
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
