import { FC, useEffect } from "react";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSeries, { CreateSeriesParams } from "../../../hooks/useSeries";
import useGPGKeys from "../../../hooks/useGPGKeys";
import { SelectOption } from "../../../types/SelectOption";
import { Distribution } from "../../../types/Distribution";
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
import { DEFAULT_MIRROR_URI } from "../../../constants";
import { testLowercaseAlphaNumeric } from "../../../utils/tests";

interface FormProps extends CreateSeriesParams {
  type: "ubuntu" | "third-party";
  hasPockets: boolean;
  pockets: string[];
  components: string[];
  architectures: string[];
}

interface NewMirrorFormProps {
  distributions: Distribution[];
}

const NewMirrorForm: FC<NewMirrorFormProps> = ({ distributions }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { createSeriesQuery } = useSeries();
  const { getGPGKeysQuery } = useGPGKeys();

  const { mutateAsync: createSeries, isLoading: isCreating } =
    createSeriesQuery;
  const { data: gpgKeysData } = getGPGKeysQuery();

  const gpgKeysOptions: SelectOption[] = (gpgKeysData?.data ?? []).map(
    ({ name }) => ({
      label: name,
      value: name,
    })
  );

  const distributionOptions: SelectOption[] = distributions.map(({ name }) => ({
    label: name,
    value: name,
  }));

  const formik = useFormik<FormProps>({
    validationSchema: Yup.object().shape({
      type: Yup.string<FormProps["type"]>()
        .defined()
        .required("This field is required."),
      hasPockets: Yup.boolean(),
      name: Yup.string()
        .required("This field is required.")
        .test({
          test: testLowercaseAlphaNumeric.test,
          message: testLowercaseAlphaNumeric.message,
        })
        .test({
          test: (value, context) => {
            return !!context.parent.distribution;
          },
          message: "First select the distribution.",
        })
        .test({
          params: { distributions },
          test: (value, context) => {
            if (!context.parent.distribution) {
              return true;
            }

            const seriesNames = distributions
              .filter(({ name }) => name === context.parent.distribution)[0]
              .series.map(({ name }) => name);

            return !seriesNames.includes(value);
          },
          message: "It must be unique within series within the distribution.",
        }),
      distribution: Yup.string().required(),
      pockets: Yup.array().of(Yup.string()),
      components: Yup.array()
        .of(Yup.string())
        .when("hasPockets", (values, schema) => {
          return values[0] ? schema.min(1) : schema.min(0);
        }),
      architectures: Yup.array().when("pockets", (values, schema) =>
        undefined !== values[0] &&
        values[0].length > 0 &&
        undefined !== values[0][0]
          ? schema.min(1, "This field requires at least 1 item.")
          : schema.min(0)
      ),
      gpg_key: Yup.string().when("pockets", (values, schema) =>
        undefined !== values[0] &&
        values[0].length > 0 &&
        undefined !== values[0][0]
          ? schema.required("This field is required.")
          : schema
      ),
      mirror_gpg_key: Yup.string(),
      mirror_uri: Yup.string().when("hasPockets", (values, schema) => {
        return values[0] ? schema.nonNullable().required() : schema;
      }),
      mirror_series: Yup.string(),
      include_udeb: Yup.boolean().required(),
    }),
    initialValues: {
      type: "ubuntu",
      hasPockets: false,
      name: "",
      mirror_series: "",
      distribution: "",
      mirror_uri: DEFAULT_MIRROR_URI,
      gpg_key: "",
      include_udeb: false,
      pockets: [],
      components: [],
      architectures: [],
    },
    onSubmit: async (values) => {
      try {
        await createSeries(
          Object.fromEntries(
            Object.entries(values).filter(
              (entry) => !["type", "hasPockets"].includes(entry[0])
            )
          ) as CreateSeriesParams
        );
      } catch (error) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    if (
      !formik.values.pockets ||
      0 === formik.values.pockets.length ||
      !formik.values.pockets[0]
    ) {
      formik.setFieldValue("hasPockets", false);

      return;
    }

    formik.setFieldValue("hasPockets", true);
  }, [formik.values.pockets?.length, formik.values.pockets?.[0]]);

  useEffect(() => {
    if ("ubuntu" === formik.values.type) {
      formik.setFieldValue("pockets", PRE_SELECTED_POCKETS);
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS);
      formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES);

      return;
    }

    formik.setFieldValue("pockets", []);
    formik.setFieldValue("components", []);
    formik.setFieldValue("architectures", []);
  }, [formik.values.type]);

  useEffect(() => {
    if (!formik.values.mirror_series || formik.values.name) {
      return undefined;
    }

    formik.setFieldValue("name", formik.values.mirror_series);
  }, [formik.values.mirror_series]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Select
        label="Type"
        required
        options={[
          { label: "Ubuntu", value: "ubuntu" },
          { label: "Third party", value: "third-party" },
        ]}
        {...formik.getFieldProps("type")}
        error={formik.touched.type && formik.errors.type}
      />

      <Select
        label="Distribution"
        required
        options={[
          { label: "Select distribution", value: "" },
          ...distributionOptions,
        ]}
        {...formik.getFieldProps("distribution")}
        error={formik.touched.distribution && formik.errors.distribution}
      />

      <Row className="u-no-padding">
        <Col size={6}>
          <Select
            label="Mirror series"
            options={[
              { label: "Select series", value: "" },
              ...PRE_DEFIED_SERIES_OPTIONS,
            ]}
            {...formik.getFieldProps("mirror_series")}
            error={formik.touched.mirror_series && formik.errors.mirror_series}
          />
        </Col>
        <Col size={6}>
          <Input
            type="text"
            required
            label="Series name"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && formik.errors.name}
          />
        </Col>
      </Row>

      <Input
        type="text"
        required={formik.values.hasPockets}
        label="Mirror URI"
        name="mirror_uri"
        value={formik.values.mirror_uri}
        onChange={(event) => {
          formik.setFieldValue("mirror_uri", event.target.value);
        }}
        error={formik.touched.mirror_uri && formik.errors.mirror_uri}
      />

      <Row className="u-no-padding">
        <Col size={6}>
          <Select
            label="Mirror GPG key"
            options={[
              { label: "Select mirror GPG key", value: "" },
              ...gpgKeysOptions,
            ]}
            {...formik.getFieldProps("mirror_gpg_key")}
            error={
              formik.touched.mirror_gpg_key && formik.errors.mirror_gpg_key
            }
          />
        </Col>

        <Col size={6}>
          <Select
            label="GPG key"
            required={formik.values.hasPockets}
            options={[
              { label: "Select GPG key", value: "" },
              ...gpgKeysOptions,
            ]}
            {...formik.getFieldProps("gpg_key")}
            error={formik.touched.gpg_key && formik.errors.gpg_key}
          />
        </Col>
      </Row>

      {"third-party" === formik.values.type && (
        <>
          <Input
            type="text"
            label="Pockets"
            placeholder="E.g. releases, security, etc."
            {...formik.getFieldProps("pockets")}
            value={formik.values.pockets && formik.values.pockets.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "pockets",
                event.target.value.split(",").map((pocket) => pocket.trim())
              );
            }}
            error={formik.touched.pockets && formik.errors.pockets}
            help="List the pocket names separated by commas"
          />

          <Input
            type="text"
            label="Components"
            required={formik.values.hasPockets}
            placeholder="E.g. main, universe, etc."
            {...formik.getFieldProps("components")}
            value={
              formik.values.components && formik.values.components.join(",")
            }
            onChange={(event) => {
              formik.setFieldValue("components", event.target.value.split(","));
            }}
            error={formik.touched.components && formik.errors.components}
            help="List the component names separated by commas"
          />

          <Input
            type="text"
            label="Architectures"
            required={formik.values.hasPockets}
            placeholder="E.g. amd64, riscv, etc."
            {...formik.getFieldProps("architectures")}
            value={
              formik.values.architectures &&
              formik.values.architectures.join(",")
            }
            onChange={(event) => {
              formik.setFieldValue(
                "architectures",
                event.target.value.split(",")
              );
            }}
            error={formik.touched.architectures && formik.errors.architectures}
            help="List the architectures separated by commas"
          />
        </>
      )}

      {"ubuntu" === formik.values.type && (
        <>
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
              <p className="p-form-validation__message">
                {formik.errors.pockets}
              </p>
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
        </>
      )}

      <CheckboxInput
        label="Include .udeb packages (debian-installer)"
        {...formik.getFieldProps("include_udeb")}
      />

      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isCreating}>
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
