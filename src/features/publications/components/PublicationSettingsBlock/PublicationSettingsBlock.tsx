import Blocks from "@/components/layout/Blocks";
import { Icon, Input, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { PUBLICATION_SETTINGS_HELP_TEXT } from "./constants";
import classes from "./PublicationSettingsBlock.module.scss";
import type { FormikValues } from "formik/dist/types";

interface PublicationSettingsBlockProps {
  readonly formik: FormikValues;
  readonly disabled?: boolean;
}

const PublicationSettingsBlock: FC<PublicationSettingsBlockProps> = ({
  formik,
  disabled = false,
}) => {
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
        checked={formik.values.hashIndexing}
        disabled={disabled}
        {...formik.getFieldProps("hashIndexing")}
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
        checked={formik.values.limitAutomaticInstallation}
        disabled={disabled}
        {...formik.getFieldProps("limitAutomaticInstallation")}
      />

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
        checked={formik.values.automaticUpgrades}
        disabled={disabled || !formik.values.limitAutomaticInstallation}
        {...formik.getFieldProps("automaticUpgrades")}
      />

      <Input
        type="checkbox"
        label="Skip bz2 compression for index files"
        checked={formik.values.skipBz2}
        disabled={disabled}
        {...formik.getFieldProps("skipBz2")}
      />

      <Input
        type="checkbox"
        label="Skip generating content idexes"
        checked={formik.values.skipContentIndexing}
        disabled={disabled}
        {...formik.getFieldProps("skipContentIndexing")}
      />
    </Blocks.Item>
  );
};

export default PublicationSettingsBlock;
