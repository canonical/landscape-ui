import { FC, useEffect, useState } from "react";
import {
  CheckboxInput,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "@canonical/react-components";
import { FormikProvider, useFormik } from "formik";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import * as Yup from "yup";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  POCKET_OPTIONS,
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
import { SelectOption } from "../../../../types/SelectOption";
import FormButtons from "../../../../components/form/FormButtons";

interface FormProps extends CreateSeriesParams {
  type: "ubuntu" | "third-party";
  pockets: string[];
  components: string[];
  architectures: string[];
  hasPockets: boolean;
}

interface NewSeriesFormProps {
  distributionData: Distribution | Distribution[];
}

const NewSeriesForm: FC<NewSeriesFormProps> = ({ distributionData }) => {
  const [mirrorUri, setMirrorUri] = useState(DEFAULT_MIRROR_URI);
  const [seriesOptions, setSeriesOptions] = useState<SelectOption[]>([]);

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { getGPGKeysQuery } = useGPGKeys();
  const { createSeriesQuery, getRepoInfo } = useSeries();

  const { data: gpgKeysData } = getGPGKeysQuery();
  const { mutateAsync: createSeries, isLoading: isCreating } =
    createSeriesQuery;

  const gpgKeys = gpgKeysData?.data ?? [];

  const distributionOptions: SelectOption[] = Array.isArray(distributionData)
    ? distributionData.map(({ name }) => ({
        label: name,
        value: name,
      }))
    : [];

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
      distribution: Yup.string().required("This field is required."),
      type: Yup.string<FormProps["type"]>().required("This field is required."),
      name: Yup.string()
        .required("This field is required.")
        .test({
          test: testLowercaseAlphaNumeric.test,
          message: testLowercaseAlphaNumeric.message,
        })
        .test({
          test: (_, context) => {
            return !!context.parent.distribution;
          },
          message: "First select the distribution.",
        })
        .test({
          params: { distributionData },
          test: (value, context) => {
            if (!context.parent.distribution) {
              return true;
            }

            const seriesNames = Array.isArray(distributionData)
              ? distributionData
                  .filter(({ name }) => name === context.parent.distribution)[0]
                  .series.map(({ name }) => name)
              : distributionData.series.map(({ name }) => name);

            return !seriesNames.includes(value);
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
            ? schema.min(1, "Please choose at least one component.")
            : schema,
        ),
      architectures: Yup.array()
        .of(Yup.string())
        .when("hasPockets", (values, schema) =>
          values[0]
            ? schema.min(1, "Please choose at least one architecture.")
            : schema,
        ),
      include_udeb: Yup.boolean().required(),
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
      } catch (error) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    if (!distributionData || Array.isArray(distributionData)) {
      return;
    }

    formik.setFieldValue("distribution", distributionData.name);
  }, [distributionData]);

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

  const {
    data: getRepoInfoResult,
    isLoading: getRepoInfoLoading,
    error: getRepoInfoError,
  } = getRepoInfo(
    {
      mirror_uri: mirrorUri,
    },
    {
      enabled: !!mirrorUri,
    },
  );

  if (getRepoInfoError) {
    debug(getRepoInfoError);
  }

  const repoInfo = getRepoInfoResult?.data;

  useEffect(() => {
    if (getRepoInfoLoading || !repoInfo) {
      setSeriesOptions([]);
      return;
    }

    formik.setFieldValue("type", repoInfo.ubuntu ? "ubuntu" : "third-party");

    setSeriesOptions(
      repoInfo.repos.map(({ description, repo }) => ({
        label: repoInfo.ubuntu ? description : repo,
        value: repo,
      })),
    );
  }, [getRepoInfoLoading, repoInfo]);

  return (
    <FormikProvider value={formik}>
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
          help="Absolute URL or file path"
          {...formik.getFieldProps("mirror_uri")}
          onBlur={(event) => {
            setMirrorUri(event.target.value);
          }}
          error={formik.touched.mirror_uri && formik.errors.mirror_uri}
        />

        {Array.isArray(distributionData) && (
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
        )}

        <Row className="u-no-padding">
          <Col size={6} medium={3} small={2}>
            <Select
              label="Mirror series"
              options={[
                { label: "Select series", value: "" },
                ...seriesOptions,
              ]}
              {...formik.getFieldProps("mirror_series")}
              error={
                formik.touched.mirror_series && formik.errors.mirror_series
              }
            />
          </Col>
          <Col size={6} medium={3} small={2}>
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
          <Col size={6} medium={3} small={2}>
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

          <Col size={6} medium={3} small={2}>
            <Select
              label="GPG key"
              required={formik.values.hasPockets}
              options={[
                { label: "Select GPG key", value: "" },
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
              error={
                formik.touched.architectures && formik.errors.architectures
              }
            />
          </>
        )}

        {"third-party" === formik.values.type && (
          <>
            <Input
              type="text"
              label="Pockets"
              placeholder="E.g. releases, security, etc."
              {...formik.getFieldProps("pockets")}
              value={formik.values.pockets.join(",")}
              onChange={(event) => {
                formik.setFieldValue(
                  "pockets",
                  event.target.value.replace(/\s/g, "").split(","),
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
              value={formik.values.components.join(",")}
              onChange={(event) => {
                formik.setFieldValue(
                  "components",
                  event.target.value.replace(/\s/g, "").split(","),
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
              value={formik.values.architectures.join(",")}
              onChange={(event) => {
                formik.setFieldValue(
                  "architectures",
                  event.target.value.replace(/\s/g, "").split(","),
                );
              }}
              error={
                formik.touched.architectures && formik.errors.architectures
              }
              help="List the architectures separated by commas"
            />
          </>
        )}

        <CheckboxInput
          label="Include .udeb packages (debian-installer)"
          {...formik.getFieldProps("include_udeb")}
        />

        <div className="form-buttons">
          <FormButtons
            isLoading={isCreating}
            positiveButtonTitle="Create mirror"
            buttonAriaLabel="Create mirror"
          />
        </div>
      </Form>
    </FormikProvider>
  );
};

export default NewSeriesForm;
