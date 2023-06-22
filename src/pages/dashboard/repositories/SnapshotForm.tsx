import { FC, useEffect } from "react";
import { Distribution } from "../../../types/Distribution";
import { Series } from "../../../types/Series";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSidePanel from "../../../hooks/useSidePanel";
import useSeries from "../../../hooks/useSeries";
import useDebug from "../../../hooks/useDebug";
import { Button, Input } from "@canonical/react-components";
import { testLowercaseAlphaNumeric } from "../../../utils/tests";

interface FormProps {
  distribution: Distribution["name"];
  origin: Series["name"];
  name: string;
}

interface SnapshotFormProps {
  distribution: Distribution;
  origin: Series["name"];
}

const SnapshotForm: FC<SnapshotFormProps> = ({ distribution, origin }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { deriveSeriesQuery } = useSeries();
  const { mutateAsync: deriveSeries, isLoading } = deriveSeriesQuery;

  const validationSchema = Yup.object().shape({
    origin: Yup.string().required("This field is required"),
    distribution: Yup.string().required("This field is required"),
    name: Yup.string()
      .required("This field is required")
      .test({
        test: testLowercaseAlphaNumeric.test,
        message: testLowercaseAlphaNumeric.message,
      })
      .test({
        params: { distribution },
        test: (value) => {
          return !distribution.series.map(({ name }) => name).includes(value);
        },
        message: "It must be unique within the distribution.",
      }),
  });

  const formik = useFormik<FormProps>({
    validationSchema,
    initialValues: {
      distribution: "",
      origin: "",
      name: "",
    },
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
    formik.setFieldValue("distribution", distribution.name);
    formik.setFieldValue("origin", origin);
  }, []);

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Snapshot name"
        required
        {...formik.getFieldProps("name")}
        error={formik.touched.name && formik.errors.name}
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
