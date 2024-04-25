import { AxiosResponse } from "axios";
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
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UdebCheckboxInput from "@/components/form/UdebCheckboxInput";
import { DEFAULT_MIRROR_URI, DEFAULT_SNAPSHOT_URI } from "@/constants";
import { ARCHITECTURE_OPTIONS, COMPONENT_OPTIONS } from "@/data/series";
import useDebug from "@/hooks/useDebug";
import useGPGKeys from "@/hooks/useGPGKeys";
import usePockets, {
  EditMirrorPocketParams,
  EditPullPocketParams,
  EditUploadPocketParams,
} from "@/hooks/usePockets";
import useSidePanel from "@/hooks/useSidePanel";
import { Distribution } from "@/types/Distribution";
import { Pocket } from "@/types/Pocket";
import { Series } from "@/types/Series";
import { assertNever } from "@/utils/debug";

interface FormProps
  extends Required<EditMirrorPocketParams>,
    Required<EditPullPocketParams>,
    Required<EditUploadPocketParams> {
  filters: string[];
  upload_gpg_keys: string[];
}

const initialValues: FormProps = {
  series: "",
  distribution: "",
  name: "",
  architectures: [],
  components: [],
  gpg_key: "",
  include_udeb: false,
  mirror_uri: DEFAULT_MIRROR_URI,
  upload_allow_unsigned: false,
  mirror_suite: "",
  mirror_gpg_key: "",
  filters: [],
  upload_gpg_keys: [],
};

const getEditPocketParams = (
  values: FormProps,
  mode: Pocket["mode"],
): EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams => {
  switch (mode) {
    case "mirror":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        mirror_uri: values.mirror_uri,
        mirror_suite: values.mirror_suite,
        mirror_gpg_key: values.mirror_gpg_key,
      };
    case "upload":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        upload_allow_unsigned: values.upload_allow_unsigned,
      };
    case "pull":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
      };
    default:
      return assertNever(mode, "pocket mode");
  }
};

interface EditPocketFormProps {
  pocket: Pocket;
  distributionName: Distribution["name"];
  seriesName: Series["name"];
}

const EditPocketForm: FC<EditPocketFormProps> = ({
  distributionName,
  pocket,
  seriesName,
}) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const {
    editPocketQuery,
    addPackageFiltersToPocketQuery,
    removePackageFiltersFromPocketQuery,
    addUploaderGPGKeysToPocketQuery,
    removeUploaderGPGKeysFromPocketQuery,
  } = usePockets();
  const { getGPGKeysQuery } = useGPGKeys();

  const { mutateAsync: editPocket, isLoading: isEditing } = editPocketQuery;
  const {
    mutateAsync: addPackageFiltersToPocket,
    isLoading: isAddingPackageFiltersToPocket,
  } = addPackageFiltersToPocketQuery;
  const {
    mutateAsync: removePackageFiltersFromPocket,
    isLoading: isRemovingPackageFiltersFromPocket,
  } = removePackageFiltersFromPocketQuery;
  const {
    mutateAsync: addUploaderGPGKeysToPocket,
    isLoading: isAddingUploaderGPGKeysToPocket,
  } = addUploaderGPGKeysToPocketQuery;
  const {
    mutateAsync: removeUploaderGPGKeysFromPocket,
    isLoading: isRemovingUploaderGPGKeysFromPocket,
  } = removeUploaderGPGKeysFromPocketQuery;
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

  const mode = pocket.mode;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    distribution: Yup.string().required("This field is required"),
    series: Yup.string().required("This field is required"),
    components: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(1, "Please choose at least one component")
      .test({
        name: "flat-mirror-sub-directory",
        message: "A single component must be passed",
        params: { mode },
        test: (value, context) => {
          const { mirror_suite } = context.parent;

          if ("mirror" === mode && /\/$/.test(mirror_suite)) {
            return 1 === value.length;
          }

          return true;
        },
      }),
    architectures: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(1, "Please choose at least one architecture"),
    gpg_key: Yup.string(),
    include_udeb: Yup.boolean(),
    mirror_uri: Yup.string(),
    mirror_suite: Yup.string(),
    mirror_gpg_key: Yup.string(),
    upload_allow_unsigned: Yup.boolean(),
    filters: Yup.array().of(Yup.string()),
    upload_gpg_keys: Yup.array().of(Yup.string()),
  });

  const formik = useFormik<FormProps>({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        const promises: Promise<AxiosResponse<Pocket>>[] = [];

        promises.push(editPocket(getEditPocketParams(values, mode)));

        if ("pull" === pocket.mode) {
          if (pocket.filter_type) {
            const deletedPackages = pocket.filters.filter(
              (originalPackage) => !values.filters.includes(originalPackage),
            );
            const addedPackages = values.filters
              .filter((x) => x)
              .filter((newPackage) => !pocket.filters.includes(newPackage));

            if (deletedPackages.length) {
              promises.push(
                removePackageFiltersFromPocket({
                  name: values.name,
                  distribution: values.distribution,
                  series: values.series,
                  packages: deletedPackages,
                }),
              );
            }

            if (addedPackages.length) {
              promises.push(
                addPackageFiltersToPocket({
                  name: values.name,
                  distribution: values.distribution,
                  series: values.series,
                  packages: addedPackages,
                }),
              );
            }
          }
        } else if ("upload" === pocket.mode && !values.upload_allow_unsigned) {
          if (pocket.upload_allow_unsigned) {
            await Promise.all(promises);

            promises.splice(0);
          }

          const pocketUploadGPGKeyNames = pocket.upload_gpg_keys.map(
            ({ name }) => name,
          );

          const addedUploaderGPGKeys = values.upload_gpg_keys.filter(
            (gpgKey) => !pocketUploadGPGKeyNames.includes(gpgKey),
          );

          const removedUploaderGPGKeys = pocketUploadGPGKeyNames.filter(
            (gpgKey) => !values.upload_gpg_keys.includes(gpgKey),
          );

          if (addedUploaderGPGKeys.length) {
            promises.push(
              addUploaderGPGKeysToPocket({
                name: values.name,
                series: values.series,
                distribution: values.distribution,
                gpg_keys: addedUploaderGPGKeys,
              }),
            );
          }

          if (removedUploaderGPGKeys.length) {
            promises.push(
              removeUploaderGPGKeysFromPocket({
                name: values.name,
                series: values.series,
                distribution: values.distribution,
                gpg_keys: removedUploaderGPGKeys,
              }),
            );
          }
        }

        await Promise.all(promises);

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("distribution", distributionName);
    formik.setFieldValue("series", seriesName);
    formik.setFieldValue("name", pocket.name);
    formik.setFieldValue("components", pocket.components);
    formik.setFieldValue("architectures", pocket.architectures);
    formik.setFieldValue("gpg_key", pocket.gpg_key?.name ?? "");
    formik.setFieldValue("include_udeb", pocket.include_udeb);
    formik.setFieldValue("mode", pocket.mode);

    if ("mirror" === pocket.mode) {
      formik.setFieldValue("mirror_uri", pocket.mirror_uri);
      formik.setFieldValue("mirror_suite", pocket.mirror_suite);
      formik.setFieldValue(
        "mirror_gpg_key",
        pocket.mirror_gpg_key ? pocket.mirror_gpg_key.name : "-",
      );
    } else if ("upload" === pocket.mode) {
      formik.setFieldValue(
        "upload_allow_unsigned",
        pocket.upload_allow_unsigned,
      );
      formik.setFieldValue(
        "upload_gpg_keys",
        pocket.upload_gpg_keys.map(({ name }) => name),
      );
    } else {
      formik.setFieldValue("filters", pocket.filters);
    }
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
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

      <Select
        label="GPG Key"
        options={privateGPGKeysOptions}
        {...formik.getFieldProps("gpg_key")}
        error={
          formik.touched.gpg_key && formik.errors.gpg_key
            ? formik.errors.gpg_key
            : undefined
        }
      />

      {"mirror" === pocket.mode &&
        !pocket.mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI) && (
          <>
            <Input
              type="text"
              label="Mirror URI"
              {...formik.getFieldProps("mirror_uri")}
              error={
                formik.touched.mirror_uri && formik.errors.mirror_uri
                  ? formik.errors.mirror_uri
                  : undefined
              }
            />

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
                { label: "Select GPG key", value: "-" },
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

      {"upload" === pocket.mode && (
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
                  ? formik.errors.upload_gpg_keys.join(", ")
                  : formik.errors.upload_gpg_keys)) ||
              undefined
            }
          />
        </>
      )}

      {"pull" === pocket.mode && pocket.filter_type && (
        <Textarea
          label="Filter packages"
          rows={3}
          help="List packages to filter separated by commas"
          {...formik.getFieldProps("filters")}
          onChange={(event) => {
            formik.setFieldValue(
              "filters",
              event.target.value.replace(/\s/g, "").split(","),
            );
          }}
          value={formik.values.filters.join(",")}
          error={
            formik.touched.filters && formik.errors.filters
              ? formik.errors.filters
              : undefined
          }
        />
      )}

      <UdebCheckboxInput formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={
          isEditing ||
          isAddingPackageFiltersToPocket ||
          isRemovingPackageFiltersFromPocket ||
          isAddingUploaderGPGKeysToPocket ||
          isRemovingUploaderGPGKeysFromPocket
        }
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditPocketForm;
