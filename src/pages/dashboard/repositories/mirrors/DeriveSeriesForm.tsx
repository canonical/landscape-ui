import { FC, useEffect } from "react";
import { Distribution } from "../../../../types/Distribution";
import { Series } from "../../../../types/Series";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSidePanel from "../../../../hooks/useSidePanel";
import useSeries from "../../../../hooks/useSeries";
import useDebug from "../../../../hooks/useDebug";
import { Input } from "@canonical/react-components";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";
import SidePanelFormButtons from "../../../../components/form/SidePanelFormButtons";

interface FormProps {
  distribution: Distribution["name"];
  origin: Series["name"];
  name: string;
}

interface DeriveSeriesProps {
  distribution: Distribution;
  origin: Series["name"];
}

const DeriveSeriesForm: FC<DeriveSeriesProps> = ({ distribution, origin }) => {
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
        label="Series name"
        required
        {...formik.getFieldProps("name")}
        error={formik.touched.name && formik.errors.name}
      />

      <p className="u-text--muted">{`You are deriving ${distribution.name}/${origin}.`}</p>

      <SidePanelFormButtons
        disabled={isLoading}
        submitButtonText="Derive series"
      />
    </form>
  );
};

export default DeriveSeriesForm;
