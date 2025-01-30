import CheckboxGroup from "@/components/form/CheckboxGroup";
import FieldDescription from "@/components/form/FieldDescription";
import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UdebCheckboxInput from "@/components/form/UdebCheckboxInput";
import { useGPGKeys } from "@/features/gpg-keys";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import type { AxiosResponse } from "axios";
import { useFormik } from "formik";
import type { FC } from "react";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  DEFAULT_SNAPSHOT_URI,
} from "../../constants";
import { usePockets } from "../../hooks";
import type { Distribution, Pocket, Series } from "../../types";
import {
  getEditPocketParams,
  getInitialValues,
  getValidationSchema,
} from "./helpers";
import type { FormProps } from "./types";

interface EditPocketFormProps {
  readonly pocket: Pocket;
  readonly distributionName: Distribution["name"];
  readonly seriesName: Series["name"];
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

  const { mutateAsync: editPocket } = editPocketQuery;
  const { mutateAsync: addPackageFiltersToPocket } =
    addPackageFiltersToPocketQuery;
  const { mutateAsync: removePackageFiltersFromPocket } =
    removePackageFiltersFromPocketQuery;
  const { mutateAsync: addUploaderGPGKeysToPocket } =
    addUploaderGPGKeysToPocketQuery;
  const { mutateAsync: removeUploaderGPGKeysFromPocket } =
    removeUploaderGPGKeysFromPocketQuery;
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

  const formik = useFormik<FormProps>({
    validationSchema: getValidationSchema(mode),
    initialValues: getInitialValues(distributionName, seriesName, pocket),
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
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
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
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditPocketForm;
