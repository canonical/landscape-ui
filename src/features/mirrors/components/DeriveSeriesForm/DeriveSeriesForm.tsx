import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import { useSeries } from "../../hooks";
import type { Distribution, Series } from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { FormProps } from "./types";

interface DeriveSeriesProps {
  readonly distribution: Distribution;
  readonly origin: Series["name"];
}

const DeriveSeriesForm: FC<DeriveSeriesProps> = ({ distribution, origin }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { deriveSeriesQuery } = useSeries();

  const { mutateAsync: deriveSeries } = deriveSeriesQuery;

  const validationSchema = Yup.object().shape({
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
    initialValues: INITIAL_VALUES,
    onSubmit: async (values) => {
      try {
        await deriveSeries({
          name: values.name,
          distribution: distribution.name,
          origin,
        });

        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Series name"
        required
        {...formik.getFieldProps("name")}
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
      />

      <p className="u-text--muted">
        You are deriving {distribution.name}/{origin}.
      </p>

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Derive series"
      />
    </Form>
  );
};

export default DeriveSeriesForm;
