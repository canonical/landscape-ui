import Blocks from "@/components/layout/Blocks";
import { Icon, Input, Tooltip } from "@canonical/react-components";
import { PUBLICATION_SETTINGS_HELP_TEXT } from "./constants";
import classes from "./PublicationSettingsBlock.module.scss";
import type { Publication } from "@canonical/landscape-openapi";
import type { FormikContextType } from "formik";
import type { PublishSettingsValues } from "../../types";
import type { ChangeEvent, JSX } from "react";

interface PublicationSettingsBlockProps<T extends PublishSettingsValues>{
  readonly formik?: FormikContextType<T>;
  readonly publication?: Publication;
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
              formik.setFieldValue("automaticUpgrades", false);
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
      hashIndexing: { checked: publication?.acquireByHash, disabled: true },
      limitAutoInstall: { checked: publication?.notAutomatic, disabled: true },
      automaticUpgrades: {
        checked: publication?.butAutomaticUpgrades,
        disabled: true,
      },
      skipBz2: { checked: publication?.skipBz2, disabled: true },
      skipContents: { checked: publication?.skipContents, disabled: true },
    };
  };

  const inputProps = getInputProps();
  const isLimitAutoInstallChecked = formik
    ? formik.values.limitAutomaticInstallation 
    : publication?.notAutomatic;

  return (
    <Blocks.Item title="Settings">
      <Input
        type="checkbox"
        label={
          <span>
            <span className={classes.label}>Hash based indexing</span>
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
            <span className={classes.label}>
              Limit automatic installation
            </span>
            <Tooltip
              message={
                PUBLICATION_SETTINGS_HELP_TEXT.limitAutomaticInstall
              }
              position="top-center"
              positionElementClassName={classes.tooltipPositionElement}
            >
              <Icon name="help" aria-hidden />
              <span className="u-off-screen">Help</span>
            </Tooltip>
          </span>
        }
        {...inputProps.limitAutoInstall}
      />

      <div aria-live="polite" aria-relevant="all">
        {isLimitAutoInstallChecked &&
          <>
            <span className="u-off-screen">
              Selecting &quot;Limit automatic installation&quot; has opened a new option
            </span>
            <Input
              type="checkbox"
              wrapperClassName={classes.subCheckbox}
              label={<span>
                <span className={classes.label}>Automatic upgrades</span>
                <Tooltip
                  message={PUBLICATION_SETTINGS_HELP_TEXT.automaticUpgrades}
                  position="top-center"
                  positionElementClassName={classes.tooltipPositionElement}
                >
                  <Icon name="help" aria-hidden />
                  <span className="u-off-screen">Help</span>
                </Tooltip>
              </span>}
              {...inputProps.automaticUpgrades}
            />
          </>
        }
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
