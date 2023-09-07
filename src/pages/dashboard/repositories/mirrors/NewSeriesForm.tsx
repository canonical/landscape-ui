import { FC, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import * as Yup from "yup";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  POCKET_OPTIONS,
  PRE_DEFIED_SERIES_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "../../../../data/series";
import useSeries, { CreateSeriesParams } from "../../../../hooks/useSeries";
import { DEFAULT_MIRROR_URI } from "../../../../constants";
import useGPGKeys from "../../../../hooks/useGPGKeys";
import { Distribution } from "../../../../types/Distribution";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";
import CheckboxGroup from "../../../../components/form/CheckboxGroup";

interface FormProps extends CreateSeriesParams {
  type: "ubuntu" | "third-party";
  pockets: string[];
  components: string[];
  architectures: string[];
  hasPockets: boolean;
}

interface NewSeriesFormProps {
  distribution: Distribution;
}

const NewSeriesForm: FC<NewSeriesFormProps> = ({ distribution }) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { getGPGKeysQuery } = useGPGKeys();
  const { createSeriesQuery } = useSeries();

  const { data: gpgKeysData } = getGPGKeysQuery();
  const { mutateAsync: createSeries, isLoading } = createSeriesQuery;

  const gpgKeys = gpgKeysData?.data ?? [];

  const formik = useFormik<FormProps>({
    initialValues: {
      type: "ubuntu",
      name: "",
      distribution: "",
      mirror_series: "",
      mirror_uri: "",
      gpg_key: "",
      pockets: [],
      components: [],
      architectures: [],
      include_udeb: false,
      hasPockets: false,
    },
    validationSchema: Yup.object().shape({
      distribution: Yup.string().required("This field is required"),
      type: Yup.string<FormProps["type"]>().required("This field is required."),
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
          message: "It must be unique within series within the distribution.",
        }),
      hasPockets: Yup.boolean(),
      mirror_series: Yup.string(),
      mirror_gpg_key: Yup.string(),
      mirror_uri: Yup.string().when("hasPockets", (values, schema) =>
        values[0]
          ? schema.nonNullable().required("This field is required.")
          : schema,
      ),
      gpg_key: Yup.string().when("hasPockets", (values, schema) =>
        values[0] ? schema.required("This field is required.") : schema,
      ),
      pockets: Yup.array().of(Yup.string()),
      components: Yup.array()
        .of(Yup.string())
        .when("hasPockets", (values, schema) =>
          values[0]
            ? schema.min(1, "Please choose at least one component")
            : schema,
        ),
      architectures: Yup.array()
        .of(Yup.string())
        .when("hasPockets", (values, schema) =>
          values[0]
            ? schema.min(1, "Please choose at least one architecture")
            : schema,
        ),
    }),
    onSubmit: async (values) => {
      try {
        await createSeries({
          name: values.name,
          distribution: values.distribution,
          mirror_series: values.mirror_series,
          gpg_key: values.gpg_key,
          include_udeb: values.include_udeb,
          mirror_uri: values.mirror_uri,
          components: values.components,
          pockets: values.pockets,
          architectures: values.architectures,
          mirror_gpg_key: values.mirror_gpg_key,
        });

        closeSidePanel();
      } catch (error: any) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("distribution", distribution.name);
  }, []);

  useEffect(() => {
    if ("ubuntu" === formik.values.type) {
      formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.ubuntu);
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.ubuntu);
      formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES.ubuntu);
      formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
    } else {
      formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.thirdParty);
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.thirdParty);
      formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.thirdParty,
      );
      formik.setFieldValue("mirror_uri", "");
    }
  }, [formik.values.type]);

  useEffect(() => {
    if (!formik.values.mirror_series || formik.values.name) {
      return undefined;
    }

    formik.setFieldValue("name", formik.values.mirror_series);
  }, [formik.values.mirror_series]);

  useEffect(() => {
    if (0 === formik.values.pockets.length || !formik.values.pockets[0]) {
      formik.setFieldValue("hasPockets", false);

      return;
    }

    formik.setFieldValue("hasPockets", true);
  }, [formik.values.pockets.length, formik.values.pockets[0]]);

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
        error={
          formik.touched.mirror_uri && formik.errors.mirror_uri
            ? formik.errors.mirror_uri
            : undefined
        }
        help="Absolute URL or file path"
        {...formik.getFieldProps("mirror_uri")}
      />

      <Row className="u-no-padding">
        <Col size={6}>
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
        </Col>

        <Col size={6}>
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
                .map((item) => ({
                  label: item.name,
                  value: item.name,
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
              { label: "Select GPG key", value: "" },
              ...gpgKeys
                .filter(({ has_secret }) => has_secret)
                .map((item) => ({
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
        </Col>
      </Row>

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

      {"third-party" === formik.values.type && (
        <>
          <Input
            type="text"
            label="Pockets"
            {...formik.getFieldProps("pockets")}
            value={formik.values.pockets.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "pockets",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={formik.touched.pockets && formik.errors.pockets}
          />
          <Input
            type="text"
            label="Components"
            required={formik.values.hasPockets}
            {...formik.getFieldProps("components")}
            value={formik.values.components.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "components",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={formik.touched.components && formik.errors.components}
          />
          <Input
            type="text"
            label="Architectures"
            required={formik.values.hasPockets}
            {...formik.getFieldProps("architectures")}
            value={formik.values.architectures.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "architectures",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={formik.touched.architectures && formik.errors.architectures}
          />
        </>
      )}

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
