import { FC, useEffect } from "react";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
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
import useSeries, { CreateSeriesParams } from "../../../hooks/useSeries";
import { DEFAULT_MIRROR_URI } from "../../../constants";
import useGPGKeys from "../../../hooks/useGPGKeys";
import useDistributions from "../../../hooks/useDistributions";

interface FormProps extends CreateSeriesParams {
  pockets: string[];
  components: string[];
  architectures: string[];
}

interface NewSeriesFormProps {
  distribution?: string;
}

const NewSeriesForm: FC<NewSeriesFormProps> = ({ distribution }) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { getGPGKeysQuery } = useGPGKeys();
  const { createSeriesQuery } = useSeries();
  const { createDistributionQuery } = useDistributions();

  const { data: gpgKeysData } = getGPGKeysQuery();
  const { mutateAsync: createDistribution } = createDistributionQuery;
  const { mutateAsync: createSeries, isLoading } = createSeriesQuery;

  const gpgKeys = gpgKeysData?.data ?? [];

  const formik = useFormik<FormProps>({
    initialValues: {
      name: "",
      distribution: distribution ?? "",
      mirror_series: "",
      mirror_uri: DEFAULT_MIRROR_URI,
      gpg_key: "",
      pockets: [],
      components: [],
      architectures: [],
      include_udeb: false,
    },
    validationSchema: Yup.object().shape({
      mirror_series: Yup.string().required("This field is required"),
      distribution: Yup.string().required("This field is required"),
      name: Yup.string().required("This field is required"),
      mirror_uri: Yup.string().required("This field is required"),
      gpg_key: Yup.string().required("This field is required"),
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
    onSubmit: async (values) => {
      try {
        if (!distribution) {
          await createDistribution({ name: values.distribution });
        }

        await createSeries(values);

        closeSidePanel();
      } catch (error: any) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("pockets", PRE_SELECTED_POCKETS);
    formik.setFieldValue("components", PRE_SELECTED_COMPONENTS);
    formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES);
  }, []);

  useEffect(() => {
    if (!formik.values.mirror_series || formik.values.name) {
      return undefined;
    }

    formik.setFieldValue("name", formik.values.mirror_series);
  }, [formik.values.mirror_series]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {!distribution && (
        <Input
          type="text"
          label="Distribution name"
          error={
            formik.touched.distribution && formik.errors.distribution
              ? formik.errors.distribution
              : undefined
          }
          {...formik.getFieldProps("distribution")}
        />
      )}

      <Select
        label="Source"
        options={[
          { label: "Select source", value: "" },
          ...PRE_DEFIED_SERIES_OPTIONS,
        ]}
        error={
          formik.touched.mirror_series && formik.errors.mirror_series
            ? formik.errors.mirror_series
            : undefined
        }
        {...formik.getFieldProps("mirror_series")}
      />

      <Input
        type="text"
        label="Mirror name"
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        {...formik.getFieldProps("name")}
      />

      <Input
        type="text"
        label="Mirror URI"
        error={
          formik.touched.mirror_uri && formik.errors.mirror_uri
            ? formik.errors.mirror_uri
            : undefined
        }
        help="Absolute URL or file path"
        {...formik.getFieldProps("mirror_uri")}
      />

      <Select
        label="GPG Key"
        options={[
          { label: "Select GPG key", value: "" },
          ...gpgKeys.map((item) => ({
            label: item.name,
            value: item.name,
          })),
        ]}
        error={
          formik.touched.gpg_key && formik.errors.gpg_key
            ? formik.errors.gpg_key
            : undefined
        }
        {...formik.getFieldProps("gpg_key")}
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
          Create mirror
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default NewSeriesForm;
