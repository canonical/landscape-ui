import { FC, useEffect } from "react";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Select,
  Switch,
} from "@canonical/react-components";
import { FormikErrors, useFormik } from "formik";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
import useDistributions from "../../../hooks/useDistributions";
import * as Yup from "yup";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  POCKET_OPTIONS,
  PRE_DEFIED_SERIES_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "../../../data/series";
import classNames from "classnames";

interface FormProps {
  series: string;
  useCustomMirrorUri: boolean;
  customMirrorUri: string;
  pockets: string[];
  components: string[];
  architectures: string[];
}

const NewMirrorForm: FC = () => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { createDistributionQuery } = useDistributions();
  // const authFetch = useFetch();

  const { mutateAsync, isLoading } = createDistributionQuery;

  const formik = useFormik<FormProps>({
    initialValues: {
      series: "",
      useCustomMirrorUri: false,
      customMirrorUri: "",
      pockets: [],
      components: [],
      architectures: [],
    },
    validationSchema: Yup.object().shape({
      series: Yup.string().required("This field is required"),
      useCustomMirrorUri: Yup.boolean(),
      customMirrorUri: Yup.string(),
      pockets: Yup.array()
        .of(Yup.string())
        .min(1, "Please choose at least one pocket"),
      components: Yup.array()
        .of(Yup.string())
        .min(1, "Please choose at least one component"),
      architectures: Yup.array()
        .of(Yup.string())
        .min(1, "Please choose at least one architecture"),
    }),
    validate: (values) => {
      const errors: FormikErrors<FormProps> = {};

      if (values.useCustomMirrorUri && !values.customMirrorUri.trim()) {
        errors.customMirrorUri = "This field is required";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await mutateAsync(values as any);

        closeSidePanel();
      } catch (error: any) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("series", PRE_DEFIED_SERIES_OPTIONS[0].value);
    formik.setFieldValue("pockets", PRE_SELECTED_POCKETS);
    formik.setFieldValue("components", PRE_SELECTED_COMPONENTS);
    formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES);
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Select
        label="Source"
        options={PRE_DEFIED_SERIES_OPTIONS}
        error={
          formik.touched.series && formik.errors.series
            ? formik.errors.series
            : undefined
        }
        {...formik.getFieldProps("series")}
      />

      <Switch
        label="Custom mirror URI"
        {...formik.getFieldProps("useCustomMirrorUri")}
      />

      {formik.values.useCustomMirrorUri && (
        <Input
          type="text"
          label="Mirror URI"
          error={
            formik.touched.customMirrorUri && formik.errors.customMirrorUri
              ? formik.errors.customMirrorUri
              : undefined
          }
          {...formik.getFieldProps("customMirrorUri")}
        />
      )}

      <fieldset
        className={classNames("checkbox-group", {
          "is-error": formik.touched.pockets && formik.errors.pockets,
        })}
        style={{
          marginTop: formik.values.useCustomMirrorUri ? "inherit" : "1.5rem",
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
