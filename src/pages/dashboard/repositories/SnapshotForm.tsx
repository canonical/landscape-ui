import { FC, useEffect } from "react";
import { Distribution } from "../../../types/Distribution";
import { Series } from "../../../types/Series";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSidePanel from "../../../hooks/useSidePanel";
import useSeries from "../../../hooks/useSeries";
import useDebug from "../../../hooks/useDebug";
import { Button, Input } from "@canonical/react-components";

const validationSchema = Yup.object().shape({
  origin: Yup.string().required("This field is required").default(""),
  distribution: Yup.string().required("This field is required").default(""),
  name: Yup.string().required("This field is required").default(""),
});

const initialValues: Yup.InferType<typeof validationSchema> =
  validationSchema.getDefault();

interface SnapshotFormProps {
  distribution: Distribution["name"];
  origin: Series["name"];
}

const SnapshotForm: FC<SnapshotFormProps> = ({ distribution, origin }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { deriveSeriesQuery } = useSeries();
  const { mutateAsync: deriveSeries, isLoading } = deriveSeriesQuery;

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        await deriveSeries(values);

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("distribution", distribution);
    formik.setFieldValue("origin", origin);
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Snapshot name"
        {...formik.getFieldProps("title")}
        error={formik.touched.title && formik.errors.title}
      />

      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isLoading}>
          Create and sync
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SnapshotForm;
