import { FC, useEffect } from "react";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSeries, { CreateSeriesParams } from "../../../hooks/useSeries";
import useGPGKeys from "../../../hooks/useGPGKeys";
import { SelectOption } from "../../../types/SelectOption";
import { Distribution } from "../../../types/Distribution";
import { PRE_DEFIED_SERIES_OPTIONS } from "../../../data/series";

interface FormProps extends CreateSeriesParams {
  type: "ubuntu" | "third-party";
  hasPockets: boolean;
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
      name: Yup.string().required("This field is required."),
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
      type: "third-party",
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
        await createSeries(values);
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
        options={[{ label: "", value: "" }, ...distributionOptions]}
        {...formik.getFieldProps("distribution")}
        error={formik.touched.distribution && formik.errors.distribution}
      />

      <Input
        type="text"
        required
        label="Series name"
        {...formik.getFieldProps("name")}
        error={formik.touched.name && formik.errors.name}
      />

      <Select
        label="Mirror series"
        options={[{ label: "", value: "" }, ...PRE_DEFIED_SERIES_OPTIONS]}
        {...formik.getFieldProps("mirror_series")}
        error={formik.touched.mirror_series && formik.errors.mirror_series}
      />

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

      <Select
        label="GPG key"
        required={formik.values.hasPockets}
        options={[{ label: "", value: "" }, ...gpgKeysOptions]}
        {...formik.getFieldProps("gpg_key")}
        error={formik.touched.gpg_key && formik.errors.gpg_key}
      />

      <Select
        label="Mirror GPG key"
        options={[{ label: "", value: "" }, ...gpgKeysOptions]}
        {...formik.getFieldProps("mirror_gpg_key")}
        error={formik.touched.mirror_gpg_key && formik.errors.mirror_gpg_key}
      />

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
