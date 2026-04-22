import MultiSelectField from "@/components/form/MultiSelectField";
import type { SelectOption } from "@/types/SelectOption";
import { Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { FC } from "react";
import type { FormProps, ThirdPartyFormProps } from "../AddMirrorForm/types";
import type { UbuntuArchiveInfo } from "../../types";
import { getFormikError } from "@/utils/formikErrors";

interface SelectableMirrorContentsBlockProps {
  readonly formik: FormikContextType<Exclude<FormProps, ThirdPartyFormProps>>;
  readonly ubuntuArchiveInfo: UbuntuArchiveInfo;
  readonly ubuntuEsmInfo: UbuntuArchiveInfo[];
}

const SelectableMirrorContentsBlock: FC<SelectableMirrorContentsBlockProps> = ({
  formik,
  ubuntuArchiveInfo,
  ubuntuEsmInfo,
}) => {
  const getDistributions = () => {
    switch (formik.values.sourceType) {
      case "ubuntu-archive":
      case "ubuntu-snapshots":
        return ubuntuArchiveInfo.distributions;
      case "ubuntu-pro":
        return ubuntuEsmInfo.find(
          ({ mirror_type }) => mirror_type === formik.values.proService,
        )!.distributions;
    }
  };

  const distributions = getDistributions();

  const distributionOptions: SelectOption[] = distributions.map(
    ({ label, slug }) => ({
      label,
      value: slug,
    }),
  );

  const componentOptions: SelectOption[] =
    distributions
      .find(({ slug }) => slug === formik.values.distribution)
      ?.components.map((component) => ({
        label: component.slug,
        value: component.slug,
      })) ?? [];

  const architectureOptions: SelectOption[] =
    distributions
      .find(({ slug }) => slug === formik.values.distribution)
      ?.architectures.map((architecture) => ({
        label: architecture.slug,
        value: architecture.slug,
      })) ?? [];

  return (
    <>
      <Select
        label="Distribution"
        required
        options={distributionOptions}
        {...formik.getFieldProps("distribution")}
        error={getFormikError(formik, "distribution")}
      />
      <MultiSelectField
        variant="condensed"
        hasSelectedItemsFirst={false}
        label="Components"
        {...formik.getFieldProps("components")}
        items={componentOptions}
        selectedItems={componentOptions.filter(({ value }) =>
          formik.values.components?.includes(value),
        )}
        onItemsUpdate={async (items) =>
          formik.setFieldValue(
            "components",
            items.map(({ value }) => value),
          )
        }
      />
      <MultiSelectField
        variant="condensed"
        hasSelectedItemsFirst={false}
        label="Architectures"
        {...formik.getFieldProps("architectures")}
        items={architectureOptions}
        selectedItems={architectureOptions.filter(({ value }) =>
          formik.values.architectures?.includes(value),
        )}
        onItemsUpdate={async (items) =>
          formik.setFieldValue(
            "architectures",
            items.map(({ value }) => value),
          )
        }
      />
    </>
  );
};

export default SelectableMirrorContentsBlock;
