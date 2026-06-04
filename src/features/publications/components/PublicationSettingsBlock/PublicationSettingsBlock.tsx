import Blocks from "@/components/layout/Blocks";
import { Input } from "@canonical/react-components";
import { PUBLICATION_SETTINGS_HELP_TEXT } from "./constants";
import classes from "./PublicationSettingsBlock.module.scss";
import type { Publication } from "@canonical/landscape-openapi";
import type { FormikContextType } from "formik";
import type { PublishSettingsValues } from "../../types";
import type { ChangeEvent, JSX } from "react";
import CheckboxInputWithHelp from "@/components/form/CheckboxInputWithHelp";

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
  const getInputProps = () => {
    if (formik) {
      return {
        hashIndexing: {
          ...formik.getFieldProps("hashIndexing"),
          checked: formik.values.hashIndexing,
        },
        limitAutoInstall: {
          ...formik.getFieldProps("limitAutomaticInstallation"),
          checked: formik.values.limitAutomaticInstallation,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.checked) {
              void formik.setFieldValue("automaticUpgrades", false);
            }
            formik.getFieldProps("limitAutomaticInstallation").onChange(e);
          },
        },
        automaticUpgrades: {
          ...formik.getFieldProps("automaticUpgrades"),
          checked: formik.values.automaticUpgrades,
        },
        skipBz2: {
          ...formik.getFieldProps("skipBz2"),
          checked: formik.values.skipBz2,
        },
        skipContents: {
          ...formik.getFieldProps("skipContentIndexing"),
          checked: formik.values.skipContentIndexing,
        },
      };
    }

    return {
      hashIndexing: {
        checked: Boolean(publication.acquireByHash),
        disabled: true,
      },
      limitAutoInstall: {
        checked: Boolean(publication.notAutomatic),
        disabled: true,
      },
      automaticUpgrades: {
        checked: Boolean(publication.butAutomaticUpgrades),
        disabled: true,
      },
      skipBz2: { checked: Boolean(publication.skipBz2), disabled: true },
      skipContents: {
        checked: Boolean(publication.skipContents),
        disabled: true,
      },
    };
  };

  const inputProps = getInputProps();
  const isLimitAutoInstallChecked = formik
    ? formik.values.limitAutomaticInstallation
    : !!publication.notAutomatic;

  return (
    <Blocks.Item title="Settings">
      <CheckboxInputWithHelp
        label="Hash based indexing"
        tooltipMessage={PUBLICATION_SETTINGS_HELP_TEXT.hashIndexing}
        {...inputProps.hashIndexing}
      />

      <CheckboxInputWithHelp
        label="Limit automatic installation"
        tooltipMessage={PUBLICATION_SETTINGS_HELP_TEXT.limitAutomaticInstall}
        {...inputProps.limitAutoInstall}
      />

      <div aria-live="polite" aria-relevant="all">
        {isLimitAutoInstallChecked && (
          <>
            <span className="u-off-screen">
              Selecting &quot;Limit automatic installation&quot; has opened a
              new option
            </span>
            <CheckboxInputWithHelp
              label="Automatic upgrades"
              tooltipMessage={PUBLICATION_SETTINGS_HELP_TEXT.automaticUpgrades}
              wrapperClassName={classes.subCheckbox}
              {...inputProps.automaticUpgrades}
            />
          </>
        )}
      </div>

      <Input
        type="checkbox"
        label="Skip bz2 compression for index files"
        {...inputProps.skipBz2}
      />

      <Input
        type="checkbox"
        label="Skip generating content indexes"
        {...inputProps.skipContents}
      />
    </Blocks.Item>
  );
};

export default PublicationSettingsBlock;
