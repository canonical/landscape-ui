import { FC } from "react";
import useDebug from "../../../../../../hooks/useDebug";
import { useWsl } from "../../../../../../hooks/useWsl";
import { Form, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import SidePanelFormButtons from "../../../../../../components/form/SidePanelFormButtons";
import { SelectOption } from "../../../../../../types/SelectOption";

interface InstallWslInstanceFormProps {
  parentId: number;
}

const InstallWslInstanceForm: FC<InstallWslInstanceFormProps> = ({
  parentId,
}) => {
  const debug = useDebug();
  const { createChildInstanceQuery, getWslInstanceNamesQuery } = useWsl();

  const {
    data: getWslInstanceNamesQueryResult,
    error: getWslInstanceNamesQueryError,
  } = getWslInstanceNamesQuery();

  if (getWslInstanceNamesQueryError) {
    debug(getWslInstanceNamesQueryError);
  }

  const instanceTypeOptions: SelectOption[] =
    getWslInstanceNamesQueryResult?.data.map(({ label, name }) => ({
      label,
      value: name,
    })) || [];

  const { mutateAsync: createChildInstance } = createChildInstanceQuery;

  const formik = useFormik({
    initialValues: { instanceType: "Ubuntu" },
    validationSchema: Yup.object({
      instanceType: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        await createChildInstance({
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
        options={instanceTypeOptions}
        {...formik.getFieldProps("instanceType")}
        error={
          formik.touched.instanceType && formik.errors.instanceType
            ? formik.errors.instanceType
            : undefined
        }
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
