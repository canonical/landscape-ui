import { FC, useEffect } from "react";
import { Distribution } from "../../../types/Distribution";
import { Series } from "../../../types/Series";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSidePanel from "../../../hooks/useSidePanel";
import useSeries from "../../../hooks/useSeries";
import useDebug from "../../../hooks/useDebug";
import { Button, CheckboxInput, Input } from "@canonical/react-components";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  POCKET_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "../../../data/series";
import classNames from "classnames";

const validationSchema = Yup.object().shape({
  origin: Yup.string().required("This field is required").default(""),
  distribution: Yup.string().required("This field is required").default(""),
  name: Yup.string().required("This field is required").default(""),
  pockets: Yup.array()
    .of(Yup.string())
    .min(1, "Please choose at least one pocket")
    .default([]),
  components: Yup.array()
    .of(Yup.string())
    .min(1, "Please choose at least one component")
    .default([]),
  architectures: Yup.array()
    .of(Yup.string())
    .min(1, "Please choose at least one architecture")
    .default([]),
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
    formik.setFieldValue("pockets", PRE_SELECTED_POCKETS);
    formik.setFieldValue("components", PRE_SELECTED_COMPONENTS);
    formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES);
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Snapshot name"
        {...formik.getFieldProps("name")}
        error={formik.touched.name && formik.errors.name}
      />

      <fieldset
        className={classNames("checkbox-group", {
          "is-error": formik.touched.pockets && formik.errors.pockets,
        })}
        style={{
          marginTop: "1.5rem",
        }}
      >
        <legend>Pockets</legend>

        {formik.touched.pockets && formik.errors.pockets && (
          <p className="p-form-validation__message">{formik.errors.pockets}</p>
        )}

        <div className="checkbox-group__inner">
          {POCKET_OPTIONS.map((option) => (
            <CheckboxInput
              key={option.value}
              label={option.label}
              {...formik.getFieldProps("pockets")}
              checked={formik.values.pockets.includes(option.value)}
              onChange={() =>
                formik.setFieldValue(
                  "pockets",
                  formik.values.pockets.includes(option.value)
                    ? formik.values.pockets.filter(
                        (item) => item !== option.value
                      )
                    : [...formik.values.pockets, option.value]
                )
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset
        className={classNames("checkbox-group", {
          "is-error": formik.touched.components && formik.errors.components,
        })}
      >
        <legend>Components</legend>

        {formik.touched.components && formik.errors.components && (
          <p className="p-form-validation__message">
            {formik.errors.components}
          </p>
        )}

        <div className="checkbox-group__inner">
          {COMPONENT_OPTIONS.map((option) => (
            <CheckboxInput
              key={option.value}
              label={option.label}
              {...formik.getFieldProps("components")}
              checked={formik.values.components.includes(option.value)}
              onChange={() =>
                formik.setFieldValue(
                  "components",
                  formik.values.components.includes(option.value)
                    ? formik.values.components.filter(
                        (item) => item !== option.value
                      )
                    : [...formik.values.components, option.value]
                )
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset
        className={classNames("checkbox-group", {
          "is-error":
            formik.touched.architectures && formik.errors.architectures,
        })}
      >
        <legend>Architectures</legend>

        {formik.touched.architectures && formik.errors.architectures && (
          <p className="p-form-validation__message">
            {formik.errors.architectures}
          </p>
        )}

        <div className="checkbox-group__inner">
          {ARCHITECTURE_OPTIONS.map((option) => (
            <CheckboxInput
              key={option.value}
              label={option.label}
              {...formik.getFieldProps("architectures")}
              checked={formik.values.architectures.includes(option.value)}
              onChange={() =>
                formik.setFieldValue(
                  "architectures",
                  formik.values.architectures.includes(option.value)
                    ? formik.values.architectures.filter(
                        (item) => item !== option.value
                      )
                    : [...formik.values.architectures, option.value]
                )
              }
            />
          ))}
        </div>
      </fieldset>

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
