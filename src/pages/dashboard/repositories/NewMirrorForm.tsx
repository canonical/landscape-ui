import { FC } from "react";
import { Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
import useDistributions from "../../../hooks/useDistributions";

const FormSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
});

const initialValues: z.infer<typeof FormSchema> = {
  name: "",
};

const NewMirrorForm: FC = () => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { createDistributionQuery } = useDistributions();

  const { mutateAsync, isLoading } = createDistributionQuery;

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(FormSchema),
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
    <Form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Name"
        {...formik.getFieldProps("name")}
        error={
          formik.touched.name ?? formik.errors.name
            ? formik.errors.name
            : undefined
        }
      />
      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isLoading}>
          Create mirror
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default NewMirrorForm;
