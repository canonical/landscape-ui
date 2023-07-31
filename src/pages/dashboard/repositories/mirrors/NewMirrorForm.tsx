import { FC, useEffect } from "react";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
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
import useSeries, { CreateSeriesParams } from "../../../../hooks/useSeries";
import useGPGKeys from "../../../../hooks/useGPGKeys";
import { SelectOption } from "../../../../types/SelectOption";
import { Distribution } from "../../../../types/Distribution";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  POCKET_OPTIONS,
  PRE_DEFIED_SERIES_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "../../../../data/series";
import { DEFAULT_MIRROR_URI } from "../../../../constants";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";
import CheckboxGroup from "../../../../components/form/CheckboxGroup";

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

  const gpgKeys = gpgKeysData?.data ?? [];

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
      distribution: Yup.string().required("This field is required."),
      pockets: Yup.array().of(Yup.string()),
      components: Yup.array()
        .of(Yup.string())
        .when("hasPockets", (values, schema) =>
          values[0]
            ? schema.min(1, "Please choose at least one component")
            : schema
        ),
      architectures: Yup.array()
        .of(Yup.string())
        .when("hasPockets", (values, schema) =>
          values[0]
            ? schema.min(1, "Please choose at least one architecture")
            : schema
        ),
      gpg_key: Yup.string().when("hasPockets", (values, schema) =>
        values[0] ? schema.required("This field is required.") : schema
      ),
      mirror_gpg_key: Yup.string(),
      mirror_uri: Yup.string().when("hasPockets", (values, schema) =>
        values[0]
          ? schema.nonNullable().required("This field is required.")
          : schema
      ),
      mirror_series: Yup.string(),
      include_udeb: Yup.boolean().required(),
    }),
    initialValues: {
      type: "ubuntu",
      hasPockets: false,
      name: "",
      mirror_series: "",
      distribution: "",
      mirror_uri: "",
      gpg_key: "",
      include_udeb: false,
      pockets: [],
      components: [],
      architectures: [],
    },
    onSubmit: async (values) => {
      try {
        await createSeries({
          name: values.name,
          distribution: values.distribution,
          pockets: values.pockets,
          components: values.components,
          architectures: values.architectures,
          gpg_key: values.gpg_key,
          mirror_gpg_key: values.mirror_gpg_key,
          mirror_uri: values.mirror_uri,
          mirror_series: values.mirror_series,
          include_udeb: values.include_udeb,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    if (0 === formik.values.pockets.length || !formik.values.pockets[0]) {
      formik.setFieldValue("hasPockets", false);

      return;
    }

    formik.setFieldValue("hasPockets", true);
  }, [formik.values.pockets.length, formik.values.pockets[0]]);

  useEffect(() => {
    if ("ubuntu" === formik.values.type) {
      formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.ubuntu);
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.ubuntu);
      formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES.ubuntu);
      formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);

      return;
    }

    formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.thirdParty);
    formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.thirdParty);
    formik.setFieldValue(
      "architectures",
      PRE_SELECTED_ARCHITECTURES.thirdParty
    );
  }, [formik.values.type]);

  useEffect(() => {
    if (!formik.values.mirror_series || formik.values.name) {
      return undefined;
    }

    formik.setFieldValue("name", formik.values.mirror_series);
  }, [formik.values.mirror_series]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
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

      <Input
        type="text"
        label="Mirror URI"
        required={formik.values.hasPockets}
        name="mirror_uri"
        value={formik.values.mirror_uri}
        onChange={(event) => {
          formik.setFieldValue("mirror_uri", event.target.value);
        }}
        error={formik.touched.mirror_uri && formik.errors.mirror_uri}
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
            label="Series name"
            required
            {...formik.getFieldProps("name")}
            error={formik.touched.name && formik.errors.name}
          />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <Col size={6}>
          <Select
            label="Mirror GPG key"
            options={[
              { label: "Select mirror GPG key", value: "" },
              ...gpgKeys
                .filter(({ has_secret }) => !has_secret)
                .map(({ name }) => ({
                  label: name,
                  value: name,
                })),
            ]}
            {...formik.getFieldProps("mirror_gpg_key")}
            error={
              formik.touched.mirror_gpg_key && formik.errors.mirror_gpg_key
            }
            help="If none is given, the stock Ubuntu archive one will be used."
          />
        </Col>

        <Col size={6}>
          <Select
            label="GPG key"
            required={formik.values.hasPockets}
            options={[
              {
                label: "Select GPG key",
                value: "",
              },
              ...gpgKeys
                .filter(({ has_secret }) => has_secret)
                .map(({ name }) => ({
                  label: name,
                  value: name,
                })),
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
                event.target.value.replace(/\s/g, "").split(",")
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
              formik.setFieldValue(
                "components",
                event.target.value.replace(/\s/g, "").split(",")
              );
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
                event.target.value.replace(/\s/g, "").split(",")
              );
            }}
            error={formik.touched.architectures && formik.errors.architectures}
            help="List the architectures separated by commas"
          />
        </>
      )}

      {"ubuntu" === formik.values.type && (
        <>
          <CheckboxGroup
            label="Pockets"
            style={{ marginTop: "1.5rem" }}
            options={POCKET_OPTIONS}
            {...formik.getFieldProps("pockets")}
            onChange={(newOptions) => {
              formik.setFieldValue("pockets", newOptions);
            }}
            error={formik.touched.pockets && formik.errors.pockets}
          />

          <CheckboxGroup
            label="Components"
            required={formik.values.hasPockets}
            options={COMPONENT_OPTIONS}
            {...formik.getFieldProps("components")}
            onChange={(newOptions) => {
              formik.setFieldValue("components", newOptions);
            }}
            error={formik.touched.components && formik.errors.components}
          />

          <CheckboxGroup
            label="Architectures"
            required={formik.values.hasPockets}
            options={ARCHITECTURE_OPTIONS}
            {...formik.getFieldProps("architectures")}
            onChange={(newOptions) => {
              formik.setFieldValue("architectures", newOptions);
            }}
            error={formik.touched.architectures && formik.errors.architectures}
          />
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
