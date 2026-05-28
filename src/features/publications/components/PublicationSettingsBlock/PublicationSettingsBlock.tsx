import Blocks from "@/components/layout/Blocks";
import { Input, Select } from "@canonical/react-components";
import { PUBLICATION_SETTINGS_HELP_TEXT } from "./constants";
import type { Publication } from "@canonical/landscape-openapi";
import type { FormikContextType } from "formik";
import type { PublishSettingsValues } from "../../types";
import CheckboxInputWithHelp from "@/components/form/CheckboxInputWithHelp";
import type { JSX } from "react";
import type { SelectOption } from "@/types/SelectOption";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import { getInstallsAndUpgradesValue } from "../../helpers";
import { AUTOMATIC_LABELS } from "../../constants";

type PublicationSettingsBlockProps<T extends PublishSettingsValues> =
  | {
      readonly formik: FormikContextType<T>;
      readonly publication?: never;
    }
  | {
      readonly formik?: never;
      readonly publication: Publication;
    };

const PublicationSettingsBlock = <T extends PublishSettingsValues>({
  formik,
  publication,
}: PublicationSettingsBlockProps<T>): JSX.Element => {
  const getCheckboxProps = () => {
    if (formik) {
      return {
        hashIndexing: formik.getFieldProps({ name: "hashIndexing", type: "checkbox" }),
        skipBz2: formik.getFieldProps({ name: "skipBz2", type: "checkbox" }),
        skipContents: formik.getFieldProps({ name: "skipContentIndexing", type: "checkbox" }),
      };
    }

    return {
      hashIndexing: { checked: !!publication.acquireByHash, disabled: true },
      skipBz2: { checked: !!publication.skipBz2, disabled: true },
      skipContents: { checked: !!publication.skipContents, disabled: true },
    };
  };

  const checkboxProps = getCheckboxProps();

  const automaticOptions: SelectOption[] = [
    { label: AUTOMATIC_LABELS.both, value: "automatic" },
    { label: AUTOMATIC_LABELS.upgrades, value: "autoUpgrades" },
    { label: AUTOMATIC_LABELS.neither, value: "manual" },
  ];

  const getAutomaticOptionValue = (values: PublishSettingsValues) => {
    if (!values.limitAutomaticInstallation) {
      return "automatic";
    }

    if (values.automaticUpgrades) {
      return "autoUpgrades";
    }

    return "manual";
  };

  return (
    <Blocks.Item title="Settings">
      {formik ? (
        <Select
          label="Installs and upgrades"
          options={automaticOptions}
          onChange={async (e) => {
            const { value } = e.target;
            if (value === "automatic") {
              await formik.setFieldValue("limitAutomaticInstallation", false);
              await formik.setFieldValue("automaticUpgrades", false);
            } else if (value === "autoUpgrades") {
              await formik.setFieldValue("limitAutomaticInstallation", true);
              await formik.setFieldValue("automaticUpgrades", true);
            } else {
              await formik.setFieldValue("limitAutomaticInstallation", true);
              await formik.setFieldValue("automaticUpgrades", false);
            }
          }}
          value={getAutomaticOptionValue(formik.values)}
        />
      ) : (
        <ReadOnlyField
          label="Installs and upgrades"
          value={getInstallsAndUpgradesValue(publication)}
        />
      )}

      <CheckboxInputWithHelp
        label="Hash based indexing"
        tooltipMessage={PUBLICATION_SETTINGS_HELP_TEXT.hashIndexing}
        {...checkboxProps.hashIndexing}
      />

      <Input
        type="checkbox"
        label="Skip bz2 compression for index files"
        {...checkboxProps.skipBz2}
      />

      <Input
        type="checkbox"
        label="Skip generating content indexes"
        {...checkboxProps.skipContents}
      />
    </Blocks.Item>
  );
};

export default PublicationSettingsBlock;
