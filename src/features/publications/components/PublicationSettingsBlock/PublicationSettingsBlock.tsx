import Blocks from "@/components/layout/Blocks";
import {
  CustomSelect,
  type CustomSelectOption,
  Input,
} from "@canonical/react-components";
import { AUTOMATIC_DESCRIPTIONS, HASH_INDEXING_HELP_TEXT } from "./constants";
import type { Publication } from "@canonical/landscape-openapi";
import type { FormikContextType } from "formik";
import type { PublishSettingsValues } from "../../types";
import CheckboxInputWithHelp from "@/components/form/CheckboxInputWithHelp";
import type { JSX } from "react";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import { getInstallsAndUpgradesText } from "../../helpers";
import { AUTOMATIC_LABELS } from "../../constants";
import LabelWithDescription from "@/components/layout/LabelWithDescription";

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
        hashIndexing: formik.getFieldProps({
          name: "hashIndexing",
          type: "checkbox",
        }),
        skipBz2: formik.getFieldProps({ name: "skipBz2", type: "checkbox" }),
        skipContents: formik.getFieldProps({
          name: "skipContentIndexing",
          type: "checkbox",
        }),
      };
    }

    return {
      hashIndexing: { checked: !!publication.acquireByHash, disabled: true },
      skipBz2: { checked: !!publication.skipBz2, disabled: true },
      skipContents: { checked: !!publication.skipContents, disabled: true },
    };
  };

  const checkboxProps = getCheckboxProps();

  const automaticOptions: CustomSelectOption[] = [
    {
      label: (
        <LabelWithDescription
          className="u-no-padding--top"
          label={AUTOMATIC_LABELS.automatic}
          description={AUTOMATIC_DESCRIPTIONS.automatic}
        />
      ),
      text: AUTOMATIC_LABELS.automatic,
      value: "automatic",
    },
    {
      label: (
        <LabelWithDescription
          className="u-no-padding--top"
          label={AUTOMATIC_LABELS.autoUpgrades}
          description={AUTOMATIC_DESCRIPTIONS.autoUpgrades}
        />
      ),
      text: AUTOMATIC_LABELS.autoUpgrades,
      value: "autoUpgrades",
    },
    {
      label: (
        <LabelWithDescription
          className="u-no-padding--top"
          label={AUTOMATIC_LABELS.manual}
          description={AUTOMATIC_DESCRIPTIONS.manual}
        />
      ),
      text: AUTOMATIC_LABELS.manual,
      value: "manual",
    },
  ];

  return (
    <Blocks.Item title="Settings">
      {formik ? (
        <CustomSelect
          label="Installs and upgrades"
          options={automaticOptions}
          {...formik.getFieldProps("installsAndUpgrades")}
          onChange={async (value) => {
            await formik.setFieldValue("installsAndUpgrades", value);
          }}
        />
      ) : (
        <ReadOnlyField
          label="Installs and upgrades"
          value={getInstallsAndUpgradesText(publication)}
          tooltipMessage="You can't change the settings of an existing publication."
        />
      )}

      <CheckboxInputWithHelp
        label="Hash based indexing"
        tooltipMessage={HASH_INDEXING_HELP_TEXT}
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
