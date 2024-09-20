import classNames from "classnames";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import CheckboxGroup from "@/components/form/CheckboxGroup";
import FieldDescription from "@/components/form/FieldDescription";
import MultiSelectField from "@/components/form/MultiSelectField";
import SelectGrouped, { groupedOption } from "@/components/form/SelectGrouped";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UdebCheckboxInput from "@/components/form/UdebCheckboxInput";
import { DEFAULT_MIRROR_URI } from "@/constants";
import {
  filterTypeOptions,
  PRE_DEFINED_POCKET_MODE_OPTIONS,
} from "@/data/pockets";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
} from "@/data/series";
import useDebug from "@/hooks/useDebug";
import useGPGKeys from "@/hooks/useGPGKeys";
import usePockets, {
  CreateMirrorPocketParams,
  CreatePullPocketParams,
  CreateUploadPocketParams,
} from "@/hooks/usePockets";
import useSidePanel from "@/hooks/useSidePanel";
import { Distribution } from "@/types/Distribution";
import { Series } from "@/types/Series";
import { assertNever } from "@/utils/debug";
import { testLowercaseAlphaNumeric } from "@/utils/tests";

interface FormProps
  extends Omit<CreateMirrorPocketParams, "mode">,
    Omit<CreatePullPocketParams, "mode" | "filter_type">,
    Omit<CreateUploadPocketParams, "mode"> {
  type: "ubuntu" | "third-party";
  mode:
    | CreateMirrorPocketParams["mode"]
    | CreatePullPocketParams["mode"]
    | CreateUploadPocketParams["mode"];
  pull_series: string;
  filter_type: CreatePullPocketParams["filter_type"] | "";
  filter_packages: string[];
  upload_gpg_keys: string[];
}

const initialValues: FormProps = {
  type: "ubuntu",
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
  mirror_uri: "",
  upload_allow_unsigned: false,
  mirror_suite: "",
  mirror_gpg_key: "",
  filter_packages: [],
  upload_gpg_keys: [],
};

const getCreatePocketParams = (
  values: FormProps,
):
  | CreateMirrorPocketParams
  | CreatePullPocketParams
  | CreateUploadPocketParams => {
  switch (values.mode) {
    case "mirror":
      return {
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
      };
    case "upload":
      return {
        mode: values.mode,
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        architectures: values.architectures,
        components: values.components,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        upload_allow_unsigned: values.upload_allow_unsigned,
      };
    case "pull":
      return {
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
        filter_type: "" !== values.filter_type ? values.filter_type : undefined,
        filter_packages: values.filter_packages,
      };
    default:
      return assertNever(values.mode, "pocket mode");
  }
};

interface NewPocketFormProps {
  distribution: Distribution;
  series: Series;
}

const NewPocketForm: FC<NewPocketFormProps> = ({ distribution, series }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createPocketQuery, addUploaderGPGKeysToPocketQuery } = usePockets();
  const { getGPGKeysQuery } = useGPGKeys();

  const { mutateAsync: createPocket } = createPocketQuery;
  const { mutateAsync: addUploaderGPGKeysToPocket } =
    addUploaderGPGKeysToPocketQuery;
  const { data: gpgKeysData } = getGPGKeysQuery();

  const privateGPGKeysOptions = (gpgKeysData?.data ?? [])
    .filter(({ has_secret }) => has_secret)
    .map((item) => ({
      label: item.name,
      value: item.name,
    }));

  const publicGPGKeysOptions = (gpgKeysData?.data ?? [])
    .filter(({ has_secret }) => !has_secret)
    .map((item) => ({
      label: item.name,
      value: item.name,
    }));

  const validationSchema = Yup.object().shape({
    type: Yup.string<FormProps["type"]>().required("This field is required."),
    name: Yup.string()
      .required("This field is required")
      .test({
        test: testLowercaseAlphaNumeric.test,
        message: testLowercaseAlphaNumeric.message,
      })
      .test({
        params: { series },
        test: (value) => {
          return !series.pockets.map(({ name }) => name).includes(value);
        },
        message: "It must be unique within series.",
      }),
    distribution: Yup.string().required("This field is required"),
    series: Yup.string().required("This field is required"),
    components: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(1, "Please choose at least one component")
      .test({
        name: "flat-mirror-sub-directory",
        message: "A single component must be passed",
        test: (value, context) => {
          const { mode, mirror_suite } = context.parent;

          if ("mirror" === mode && /\/$/.test(mirror_suite)) {
            return 1 === value.length;
          }

          return true;
        },
      })
      .required("This field is required"),
    architectures: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(1, "Please choose at least one architecture"),
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
    pull_series: Yup.string(),
    filter_type: Yup.string<"blacklist" | "whitelist">(),
    filter_packages: Yup.array().of(Yup.string().defined()),
    upload_allow_unsigned: Yup.boolean(),
    upload_gpg_keys: Yup.array().of(Yup.string().defined()),
  });

  const formik = useFormik<FormProps>({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        await createPocket(getCreatePocketParams(values));

        if (
          "upload" === values.mode &&
          !values.upload_allow_unsigned &&
          values.upload_gpg_keys.length
        ) {
          await addUploaderGPGKeysToPocket({
            name: values.name,
            series: values.series,
            distribution: values.distribution,
            gpg_keys: values.upload_gpg_keys,
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
  }, []);

  useEffect(() => {
    if ("ubuntu" === formik.values.type) {
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.ubuntu);
      formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES.ubuntu);

      if ("mirror" === formik.values.mode) {
        formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
      }
    } else {
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.thirdParty);
      formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.thirdParty,
      );

      if ("mirror" === formik.values.mode) {
        formik.setFieldValue("mirror_uri", "");
      }
    }
  }, [formik.values.type, formik.values.mode]);

  const groupedPocketOptionsNew: groupedOption[] = distribution.series.map(
    (item) => ({
      options: item.pockets.map(({ name }) => ({
        label: name,
        value: name,
      })),
      optGroup: item.name,
    }),
  );

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
        error={
          formik.touched.type && formik.errors.type
            ? formik.errors.type
            : undefined
        }
      />

      <Select
        label="Mode"
        required
        options={[...PRE_DEFINED_POCKET_MODE_OPTIONS]}
        {...formik.getFieldProps("mode")}
        error={
          formik.touched.mode && formik.errors.mode
            ? formik.errors.mode
            : undefined
        }
      />

      {"mirror" === formik.values.mode && (
        <Input
          type="text"
          label="Mirror URI"
          required
          {...formik.getFieldProps("mirror_uri")}
          error={
            formik.touched.mirror_uri && formik.errors.mirror_uri
              ? formik.errors.mirror_uri
              : undefined
          }
        />
      )}

      <div
        className={classNames({
          row: "pull" === formik.values.mode,
          "u-no-padding--left": "pull" === formik.values.mode,
          "u-no-padding--right": "pull" === formik.values.mode,
        })}
      >
        <Input
          type="text"
          label="Name"
          required
          wrapperClassName={classNames({
            "col-6": "pull" === formik.values.mode,
          })}
          style={{ display: "block !important" }}
          {...formik.getFieldProps("name")}
          error={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : undefined
          }
        />

        {"pull" == formik.values.mode && (
          <SelectGrouped
            label="Pull from"
            required
            name="pull_pocket"
            wrapperClassName="col-6"
            groupedOptions={groupedPocketOptionsNew}
            option={formik.values.pull_pocket}
            group={formik.values.pull_series}
            emptyOption={{ enabled: true, label: "Select pull pocket" }}
            onChange={async (newOption, newGroup) => {
              await formik.setFieldValue("pull_pocket", newOption);
              await formik.setFieldValue("pull_series", newGroup);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.pull_pocket && formik.errors.pull_pocket
                ? formik.errors.pull_pocket
                : undefined
            }
          />
        )}
      </div>

      <Select
        label="GPG Key"
        required
        options={[
          { label: "Select GPG key", value: "" },
          ...privateGPGKeysOptions,
        ]}
        {...formik.getFieldProps("gpg_key")}
        error={
          formik.touched.gpg_key && formik.errors.gpg_key
            ? formik.errors.gpg_key
            : undefined
        }
      />

      {"mirror" === formik.values.mode && (
        <>
          <Input
            type="text"
            label={
              <FieldDescription
                label="Mirror suite"
                description={
                  <>
                    <span>
                      {
                        "The specific sub-directory under dists/ that should be mirrored. If the suite name ends with a ‘/’, the remote repository is flat (no dists/ structure, see "
                      }
                    </span>
                    <a
                      href="http://wiki.debian.org/RepositoryFormat#Flat_Repository_Format"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                    >
                      wiki.debian.org/RepositoryFormat#Flat_Repository_Format
                    </a>
                    <span>
                      ); in this case a single value must be passed for the
                      ‘components’ parameter. Packages from the remote
                      repository will be mirrored in the specified component.
                      This parameter is optional and defaults to the same name
                      as local series and pocket.
                    </span>
                  </>
                }
              />
            }
            {...formik.getFieldProps("mirror_suite")}
            error={
              formik.touched.mirror_suite && formik.errors.mirror_suite
                ? formik.errors.mirror_suite
                : undefined
            }
          />

          <Select
            label="Mirror GPG key"
            options={[
              { label: "Select GPG key", value: "" },
              ...publicGPGKeysOptions,
            ]}
            {...formik.getFieldProps("mirror_gpg_key")}
            error={
              formik.touched.mirror_gpg_key && formik.errors.mirror_gpg_key
                ? formik.errors.mirror_gpg_key
                : undefined
            }
            help="If none is given, the stock Ubuntu archive one will be used."
          />
        </>
      )}

      {"pull" === formik.values.mode && (
        <>
          <Select
            label="Filter type"
            options={filterTypeOptions}
            {...formik.getFieldProps("filter_type")}
            error={
              formik.touched.filter_type && formik.errors.filter_type
                ? formik.errors.filter_type
                : undefined
            }
          />

          {"" !== formik.values.filter_type && (
            <Textarea
              label="Filter packages"
              rows={3}
              help="List packages to filter separated by commas"
              {...formik.getFieldProps("filter_packages")}
              onChange={(event) => {
                formik.setFieldValue(
                  "filter_packages",
                  event.target.value.replace(/\s/g, "").split(","),
                );
              }}
              value={formik.values.filter_packages.join(",")}
              error={
                formik.touched.filter_packages && formik.errors.filter_packages
                  ? formik.errors.filter_packages
                  : undefined
              }
            />
          )}
        </>
      )}

      {"upload" === formik.values.mode && (
        <>
          <CheckboxInput
            label="Allow uploaded packages to be unsigned"
            {...formik.getFieldProps("upload_allow_unsigned")}
            checked={formik.values.upload_allow_unsigned}
          />

          <MultiSelectField
            variant="condensed"
            label="Uploader GPG keys"
            disabled={formik.values.upload_allow_unsigned}
            items={publicGPGKeysOptions}
            selectedItems={publicGPGKeysOptions.filter(({ value }) =>
              formik.values.upload_gpg_keys.includes(value),
            )}
            onItemsUpdate={(items) => {
              formik.setFieldValue(
                "upload_gpg_keys",
                items.map(({ value }) => value),
              );
            }}
            error={
              (formik.touched.upload_gpg_keys &&
                (Array.isArray(formik.errors.upload_gpg_keys)
                  ? formik.errors.upload_gpg_keys[0]
                  : formik.errors.upload_gpg_keys)) ||
              undefined
            }
          />
        </>
      )}

      {"ubuntu" === formik.values.type && (
        <>
          <CheckboxGroup
            label="Components"
            required
            options={COMPONENT_OPTIONS}
            {...formik.getFieldProps("components")}
            onChange={(newOptions) => {
              formik.setFieldValue("components", newOptions);
            }}
            error={
              formik.touched.components && formik.errors.components
                ? formik.errors.components
                : undefined
            }
          />

          <CheckboxGroup
            label="Architectures"
            required
            options={ARCHITECTURE_OPTIONS}
            {...formik.getFieldProps("architectures")}
            onChange={(newOptions) => {
              formik.setFieldValue("architectures", newOptions);
            }}
            error={
              formik.touched.architectures && formik.errors.architectures
                ? formik.errors.architectures
                : undefined
            }
          />
        </>
      )}

      {"third-party" === formik.values.type && (
        <>
          <Input
            type="text"
            label="Components"
            required
            {...formik.getFieldProps("components")}
            value={formik.values.components.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "components",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={
              formik.touched.components && formik.errors.components
                ? formik.errors.components
                : undefined
            }
          />

          <Input
            type="text"
            label="Architectures"
            required
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
                ? formik.errors.architectures
                : undefined
            }
          />
        </>
      )}

      <UdebCheckboxInput formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add"
        submitButtonAriaLabel="Add pocket"
      />
    </Form>
  );
};

export default NewPocketForm;
