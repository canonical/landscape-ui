import MultiSelectField from "@/components/form/MultiSelectField";
import type { SelectOption } from "@/types/SelectOption";
import { Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { FC } from "react";
import type { FormProps, ThirdPartyFormProps } from "../AddMirrorForm/types";
import type { UbuntuArchiveInfo } from "../../types";
import { getFormikError } from "@/utils/formikErrors";
import { hasOneItem } from "@/utils/_helpers";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import { isDistributionValid } from "../../helpers";

interface SelectableMirrorContentsBlockProps {
  readonly formik: FormikContextType<Exclude<FormProps, ThirdPartyFormProps>>;
  readonly ubuntuArchiveInfo: UbuntuArchiveInfo | undefined;
  readonly ubuntuEsmInfo: UbuntuArchiveInfo[];
  readonly isLoading?: boolean;
}

const SelectableMirrorContentsBlock: FC<SelectableMirrorContentsBlockProps> = ({
  formik,
  ubuntuArchiveInfo,
  ubuntuEsmInfo,
  isLoading,
}) => {
  const getDistributions = () => {
    switch (formik.values.sourceType) {
      case "ubuntu-archive":
      case "ubuntu-snapshots": {
        return ubuntuArchiveInfo?.distributions ?? [];
      }

      case "ubuntu-pro": {
        const proService = ubuntuEsmInfo.find(
          ({ mirror_type }) => mirror_type === formik.values.proService,
        );

        return proService ? proService.distributions : [];
      }
    }
  };

  const distributions = getDistributions();

  const distributionOptions: SelectOption[] = distributions.map(
    (distribution) => ({
      label: distribution.label,
      value: distribution.slug,
      disabled: !isDistributionValid(distribution),
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
      {hasOneItem(distributionOptions) ? (
        <ReadOnlyField
          label="Distribution"
          value={distributionOptions[0].label}
          tooltipMessage="This source only has one distribution."
        />
      ) : (
        <Select
          label="Distribution"
          required
          options={distributionOptions}
          {...formik.getFieldProps("distribution")}
          disabled={isLoading}
          error={getFormikError(formik, "distribution")}
        />
      )}
      {hasOneItem(componentOptions) ? (
        <ReadOnlyField
          label="Components"
          value={componentOptions[0].label}
          tooltipMessage="This distribution only has one component."
        />
      ) : (
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
          disabled={isLoading}
          required
        />
      )}
      {hasOneItem(architectureOptions) ? (
        <ReadOnlyField
          label="Architectures"
          value={architectureOptions[0].label}
          tooltipMessage="This distribution only has one architecture."
        />
      ) : (
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
          disabled={isLoading}
          required
        />
      )}
    </>
  );
};

export default SelectableMirrorContentsBlock;
