import { FC, useEffect } from "react";
import { Series } from "../../../types/Series";
import { Distribution } from "../../../types/Distribution";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePockets, {
  CreatePocketParamsMirror,
  CreatePocketParamsPull,
  CreatePocketParamsUpload,
} from "../../../hooks/usePockets";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import classNames from "classnames";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
} from "../../../data/series";
import useGPGKeys from "../../../hooks/useGPGKeys";
import {
  filterTypeOptions,
  PRE_DEFINED_POCKET_MODE_OPTIONS,
} from "../../../data/pockets";
import { DEFAULT_MIRROR_URI } from "../../../constants";
import { SelectOption } from "../../../types/SelectOption";

interface FormProps
  extends Omit<CreatePocketParamsMirror, "mode">,
    Omit<CreatePocketParamsPull, "mode" | "filter_type">,
    Omit<CreatePocketParamsUpload, "mode"> {
  mode:
    | CreatePocketParamsMirror["mode"]
    | CreatePocketParamsPull["mode"]
    | CreatePocketParamsUpload["mode"];
  pull_series: string;
  filter_type: CreatePocketParamsPull["filter_type"] | "";
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  distribution: Yup.string().required("This field is required"),
  series: Yup.string().required("This field is required"),
  components: Yup.array()
    .of(Yup.string().defined())
    .min(1, "Please choose at least one component")
    .required("This field is required"),
  architectures: Yup.array()
    .of(Yup.string().defined())
    .min(1, "Please choose at least one architecture")
    .required("This field is required"),
  mode: Yup.string<FormProps["mode"]>().required("This field is required"),
  gpg_key: Yup.string().required("This field is required"),
  include_udeb: Yup.boolean().required("This field is required"),
  mirror_uri: Yup.string().when("mode", {
    is: "mirror",
    then: (schema) => schema.required("This field is required"),
  }),
  mirror_suite: Yup.string(),
  mirror_gpg_key: Yup.string(),
  pull_pocket: Yup.string().when("mode", {
    is: "pull",
    then: (schema) => schema.required("This field is required"),
  }),
  pull_series: Yup.string().defined(),
  filter_type: Yup.string<"blacklist" | "whitelist">(),
  filters: Yup.array(),
  upload_allow_unsigned: Yup.boolean(),
});

const initialValues: FormProps = {
  series: "",
  distribution: "",
  name: "",
  architectures: [],
  components: [],
  gpg_key: "",
  include_udeb: false,
  filter_type: "",
  mode: "mirror",
  pull_pocket: "",
  pull_series: "",
  mirror_uri: DEFAULT_MIRROR_URI,
  upload_allow_unsigned: false,
  mirror_suite: "",
  mirror_gpg_key: "",
  filters: [],
};

interface NewPocketFormProps {
  distribution: Distribution;
  series: Series;
}

const NewPocketForm: FC<NewPocketFormProps> = ({ distribution, series }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createPocketQuery } = usePockets();
  const { getGPGKeysQuery } = useGPGKeys();

  const { mutateAsync: createPocket, isLoading: isCreating } =
    createPocketQuery;
  const { data: gpgKeysData } = getGPGKeysQuery();

  const gpgKeys = gpgKeysData?.data ?? [];

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        if ("upload" === values.mode) {
          await createPocket({
            mode: values.mode,
            distribution: values.distribution,
            series: values.series,
            name: values.name,
            architectures: values.architectures,
            components: values.components,
            gpg_key: values.gpg_key,
            include_udeb: values.include_udeb,
            upload_allow_unsigned: values.upload_allow_unsigned,
          });
        } else if ("mirror" === values.mode) {
          await createPocket({
            mode: values.mode,
            distribution: values.distribution,
            series: values.series,
            name: values.name,
            architectures: values.architectures,
            components: values.components,
            gpg_key: values.gpg_key,
            include_udeb: values.include_udeb,
            mirror_uri: values.mirror_uri,
            mirror_suite: values.mirror_suite,
            mirror_gpg_key: values.mirror_gpg_key,
          });
        } else {
          await createPocket({
            mode: values.mode,
            distribution: values.distribution,
            series: values.series,
            name: values.name,
            architectures: values.architectures,
            components: values.components,
            gpg_key: values.gpg_key,
            include_udeb: values.include_udeb,
            pull_series: values.pull_series,
            pull_pocket: values.pull_pocket,
            filter_type:
              "" !== values.filter_type ? values.filter_type : undefined,
            filters: values.filters,
          });
        }

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("distribution", distribution.name);
    formik.setFieldValue("series", series.name);
    formik.setFieldValue("components", PRE_SELECTED_COMPONENTS);
    formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES);
  }, []);

  const pullSeriesOptions: SelectOption[] = distribution.series.map(
    ({ name }) => ({ value: name, label: name })
  );

  const pullPocketsOptions: SelectOption[] = distribution.series
    .filter(({ name }) =>
      formik.values.pull_series
        ? name === formik.values.pull_series
        : name === series.name
    )[0]
    .pockets.map(({ name: pocketName }) => {
      const seriesName =
        "" !== formik.values.pull_series
          ? formik.values.pull_series
          : series.name;

      return {
        value: pocketName,
        label: `${seriesName}/${pocketName}`,
      };
    });

  return (
    <Form>
      <Input
        type="text"
        label="Name"
        {...formik.getFieldProps("name")}
        error={formik.touched.name && formik.errors.name}
      />

      <Input
        type="text"
        hidden
        {...formik.getFieldProps("series")}
        error={formik.touched.series && formik.errors.series}
      />

      <Input
        type="text"
        hidden
        {...formik.getFieldProps("distribution")}
        error={formik.touched.distribution && formik.errors.distribution}
      />

      <Select
        label="Mode"
        options={[...PRE_DEFINED_POCKET_MODE_OPTIONS]}
        {...formik.getFieldProps("mode")}
        error={formik.touched.mode && formik.errors.mode}
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
        {...formik.getFieldProps("gpg_key")}
        error={formik.touched.gpg_key && formik.errors.gpg_key}
      />

      {"mirror" === formik.values.mode && (
        <>
          <Input
            type="text"
            label="Mirror URI"
            {...formik.getFieldProps("mirror_uri")}
            error={formik.touched.mirror_uri && formik.errors.mirror_uri}
          />

          <Input
            type="text"
            label="Mirror suite"
            {...formik.getFieldProps("mirror_suite")}
            error={formik.touched.mirror_suite && formik.errors.mirror_suite}
          />

          <Input
            type="text"
            label="Mirror GPG key"
            {...formik.getFieldProps("mirror_gpg_key")}
            error={
              formik.touched.mirror_gpg_key && formik.errors.mirror_gpg_key
            }
          />
        </>
      )}

      {"pull" === formik.values.mode && (
        <>
          <Select
            label="Pull series"
            options={[
              { label: "Select pull series", value: "" },
              ...pullSeriesOptions,
            ]}
            {...formik.getFieldProps("pull_series")}
            error={formik.touched.pull_series && formik.errors.pull_series}
          />

          <Select
            label="Pull pocket"
            options={[
              { label: "Select pull pocket", value: "" },
              ...pullPocketsOptions,
            ]}
            {...formik.getFieldProps("pull_pocket")}
            error={formik.touched.pull_pocket && formik.errors.pull_pocket}
          />

          <Select
            label="Filter type"
            options={filterTypeOptions}
            {...formik.getFieldProps("filter_type")}
            error={formik.touched.filter_type && formik.errors.filter_type}
          />

          {"" !== formik.values.filter_type && (
            <Textarea
              label="Filter packages"
              rows={3}
              help="List packages to filter separated by commas or one item per line"
              {...formik.getFieldProps("filters")}
              onChange={(event) => {
                formik.setFieldValue(
                  "filters",
                  event.target.value.split(/,\s*/)
                );
              }}
              value={formik.values.filters.join(",")}
              error={formik.touched.filters && formik.errors.filters}
            />
          )}
        </>
      )}

      {"upload" === formik.values.mode && (
        <CheckboxInput
          label="Allow uploaded packages to be unsigned"
          {...formik.getFieldProps("upload_allow_unsigned")}
          checked={formik.values.upload_allow_unsigned}
        />
      )}

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

      <CheckboxInput
        label="Include .udeb packages (debian-installer)"
        {...formik.getFieldProps("include_udeb")}
        checked={formik.values.include_udeb}
      />

      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isCreating}>
          Create
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default NewPocketForm;
