import CheckboxGroup from "@/components/form/CheckboxGroup";
import FieldDescription from "@/components/form/FieldDescription";
import MultiSelectField from "@/components/form/MultiSelectField";
import type { groupedOption } from "@/components/form/SelectGrouped";
import SelectGrouped from "@/components/form/SelectGrouped";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UdebCheckboxInput from "@/components/form/UdebCheckboxInput";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import type { FC } from "react";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  DEFAULT_MIRROR_URI,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
} from "../../constants";
import { useGPGKeysOptions, usePockets } from "../../hooks";
import type { Distribution, Series } from "../../types";
import {
  filterTypeOptions,
  PRE_DEFINED_POCKET_MODE_OPTIONS,
} from "./constants";
import {
  getCreatePocketParams,
  getInitialValues,
  getValidationSchema,
} from "./helpers";
import type { FormProps } from "./types";

interface NewPocketFormProps {
  readonly distribution: Distribution;
  readonly series: Series;
}

const NewPocketForm: FC<NewPocketFormProps> = ({ distribution, series }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createPocketQuery, addUploaderGPGKeysToPocketQuery } = usePockets();

  const { mutateAsync: createPocket } = createPocketQuery;
  const { mutateAsync: addUploaderGPGKeysToPocket } =
    addUploaderGPGKeysToPocketQuery;
  const { privateGPGKeysOptions, publicGPGKeysOptions } = useGPGKeysOptions();

  const formik = useFormik<FormProps>({
    initialValues: getInitialValues(distribution.name, series.name),
    validationSchema: getValidationSchema(series),
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
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const newType = event.target.value as "ubuntu" | "third-party";
    const newFields: Partial<FormProps> =
      newType === "ubuntu"
        ? {
            type: newType,
            components: PRE_SELECTED_COMPONENTS.ubuntu,
            architectures: PRE_SELECTED_ARCHITECTURES.ubuntu,
            mirror_uri:
              formik.values.mode === "mirror" ? DEFAULT_MIRROR_URI : "",
          }
        : {
            type: newType,
            components: PRE_SELECTED_COMPONENTS.thirdParty,
            architectures: PRE_SELECTED_ARCHITECTURES.thirdParty,
            mirror_uri: formik.values.mode === "mirror" ? "" : undefined,
          };

    formik.setValues({
      ...formik.values,
      ...newFields,
    });
  };

  const handleModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const newMode = event.target.value;
    if (newMode === "mirror" && formik.values.type === "ubuntu") {
      formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
    } else {
      formik.setFieldValue("mirror_uri", "");
    }
    formik.setFieldValue("mode", newMode);
  };

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
        onChange={handleTypeChange}
        error={getFormikError(formik, "type")}
      />

      <Select
        label="Mode"
        required
        options={PRE_DEFINED_POCKET_MODE_OPTIONS}
        {...formik.getFieldProps("mode")}
        onChange={handleModeChange}
        error={getFormikError(formik, "mode")}
      />

      {"mirror" === formik.values.mode && (
        <Input
          type="text"
          label="Mirror URI"
          required
          {...formik.getFieldProps("mirror_uri")}
          error={getFormikError(formik, "mirror_uri")}
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
          error={getFormikError(formik, "name")}
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
            error={getFormikError(formik, "pull_pocket")}
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
        error={getFormikError(formik, "gpg_key")}
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
            error={getFormikError(formik, "mirror_suite")}
          />

          <Select
            label="Mirror GPG key"
            options={[
              { label: "Select GPG key", value: "" },
              ...publicGPGKeysOptions,
            ]}
            {...formik.getFieldProps("mirror_gpg_key")}
            error={getFormikError(formik, "mirror_gpg_key")}
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
            error={getFormikError(formik, "filter_type")}
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
              error={getFormikError(formik, "filter_packages")}
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
            error={getFormikError(formik, "upload_gpg_keys")}
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
            error={getFormikError(formik, "components")}
          />

          <CheckboxGroup
            label="Architectures"
            required
            options={ARCHITECTURE_OPTIONS}
            {...formik.getFieldProps("architectures")}
            onChange={(newOptions) => {
              formik.setFieldValue("architectures", newOptions);
            }}
            error={getFormikError(formik, "architectures")}
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
            error={getFormikError(formik, "components")}
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
            error={getFormikError(formik, "architectures")}
          />
        </>
      )}

      <UdebCheckboxInput formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add pocket"
        submitButtonAriaLabel="Add pocket"
      />
    </Form>
  );
};

export default NewPocketForm;
