import { FC } from "react";
import { Form, Input, Textarea } from "@canonical/react-components";
import { useFormik } from "formik";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import * as Yup from "yup";
import useGPGKeys from "../../../../hooks/useGPGKeys";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";
import SidePanelFormButtons from "../../../../components/form/SidePanelFormButtons";

interface FormProps {
  name: string;
  material: string;
}

const NewGPGKeyForm: FC = () => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { importGPGKeyQuery, getGPGKeysQuery } = useGPGKeys();

  const { mutateAsync, isLoading } = importGPGKeyQuery;

  const { data: getGPGKeysResponse } = getGPGKeysQuery();

  const formik = useFormik<FormProps>({
    initialValues: {
      name: "",
      material: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("This field is required")
        .test({
          test: testLowercaseAlphaNumeric.test,
          message: testLowercaseAlphaNumeric.message,
        })
        .test({
          params: { getGPGKeysResponse },
          test: (value) => {
            return !(getGPGKeysResponse?.data ?? [])
              .map(({ name }) => name)
              .includes(value);
          },
          message: "It must be unique within the account.",
        }),
      material: Yup.string()
        .required("This field is required")
        .transform((value) => encodeURIComponent(value)),
    }),
    onSubmit: async (values) => {
      try {
        await mutateAsync(values);

        closeSidePanel();
      } catch (error: any) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
        required
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        {...formik.getFieldProps("name")}
      />

      <Textarea
        label="Material"
        required
        rows={10}
        error={
          formik.touched.material && formik.errors.material
            ? formik.errors.material
            : undefined
        }
        {...formik.getFieldProps("material")}
      />
      <SidePanelFormButtons
        submitButtonDisabled={isLoading}
        submitButtonText="Import key"
      />
    </Form>
  );
};

export default NewGPGKeyForm;
