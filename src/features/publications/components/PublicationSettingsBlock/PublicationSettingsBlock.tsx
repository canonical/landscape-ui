import Blocks from "@/components/layout/Blocks";
import { Icon, Input, Tooltip } from "@canonical/react-components";
import { PUBLICATION_SETTINGS_HELP_TEXT } from "./constants";
import classes from "./PublicationSettingsBlock.module.scss";
import type { Publication } from "@canonical/landscape-openapi";
import type { FormikContextType } from "formik";
import type { PublishNewFormValues } from "../../types";
import type { ChangeEvent, JSX } from "react";

interface PublicationSettingsBlockProps<T extends PublishNewFormValues>{
  readonly formik?: FormikContextType<T>;
  readonly publication?: Publication;
};

const PublicationSettingsBlock = <T extends PublishNewFormValues>({
  formik,
  publication,
}: PublicationSettingsBlockProps<T>): JSX.Element => {

  const getInputProps = () => {
    if (formik) {
      return {
        hashIndexing: { ...formik.getFieldProps("hashIndexing") },
        limitAutomaticInstallation: { 
          ...formik.getFieldProps("limitAutomaticInstallation"),
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.checked) {
              formik.setFieldValue("automaticUpgrades", false);
            }
            formik.getFieldProps("limitAutomaticInstallation").onChange(e);
          },
        },
        automaticUpgrades: {
          disabled: !formik.values.limitAutomaticInstallation,
          ...formik.getFieldProps("automaticUpgrades"),
        },
        skipBz2: { ...formik.getFieldProps("skipBz2") },
        skipContentIndexing: { ...formik.getFieldProps("skipContentIndexing") },
      };
    }

    return {
      hashIndexing: {
        checked: publication?.acquireByHash,
        disabled: true,
      },
      limitAutomaticInstallation: {
        checked: publication?.notAutomatic,
        disabled: true,
      },
      automaticUpgrades: {
        checked: publication?.butAutomaticUpgrades,
        disabled: true,
      },
      skipBz2: {
        checked: publication?.skipBz2,
        disabled: true,
      },
      skipContentIndexing: {
        checked: publication?.skipContents,
        disabled: true,
      },
    };
  };

  const inputProps = getInputProps();
  const isLimitAutomaticInstallationChecked = formik
    ? formik.values.limitAutomaticInstallation 
    : publication?.notAutomatic;

  return (
    <Blocks.Item title="Settings">
      <Input
        type="checkbox"
        label={
          <span>
            <span className={classes.settingLabel}>Hash based indexing</span>
            <Tooltip
              message={PUBLICATION_SETTINGS_HELP_TEXT.hashIndexing}
              position="top-center"
              positionElementClassName={classes.tooltipPositionElement}
            >
              <Icon name="help" aria-hidden />
              <span className="u-off-screen">Help</span>
            </Tooltip>
          </span>
        }
        {...inputProps.hashIndexing}
      />

      <Input
        type="checkbox"
        label={
          <span>
            <span className={classes.settingLabel}>
              Limit automatic installation
            </span>
            <Tooltip
              message={
                PUBLICATION_SETTINGS_HELP_TEXT.limitAutomaticInstallation
              }
              position="top-center"
              positionElementClassName={classes.tooltipPositionElement}
            >
              <Icon name="help" aria-hidden />
              <span className="u-off-screen">Help</span>
            </Tooltip>
          </span>
        }
        {...inputProps.limitAutomaticInstallation}
      />

      {isLimitAutomaticInstallationChecked &&
        <Input
          type="checkbox"
          wrapperClassName={classes.subCheckbox}
          label={
            <span>
              <span className={classes.settingLabel}>Automatic upgrades</span>
              <Tooltip
                message={PUBLICATION_SETTINGS_HELP_TEXT.automaticUpgrades}
                position="top-center"
                positionElementClassName={classes.tooltipPositionElement}
              >
                <Icon name="help" aria-hidden />
                <span className="u-off-screen">Help</span>
              </Tooltip>
            </span>
          }
          {...inputProps.automaticUpgrades}
        />
      }

      <Input
        type="checkbox"
        label="Skip bz2 compression for index files"
        {...inputProps.skipBz2}
      />

      <Input
        type="checkbox"
        label="Skip generating content indexes"
        {...inputProps.skipContentIndexing}
      />
    </Blocks.Item>
  );
};

export default PublicationSettingsBlock;
