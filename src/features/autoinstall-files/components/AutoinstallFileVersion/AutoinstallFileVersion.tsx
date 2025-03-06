import CodeEditor from "@/components/form/CodeEditor";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import { Button, Icon, Input } from "@canonical/react-components";
import moment from "moment";
import type { ComponentProps } from "react";
import { useState, type FC } from "react";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { AutoinstallFile } from "../../types";
import classes from "./AutoinstallFileVersion.module.scss";
import { BUTTON_TIMEOUT } from "./constants";

interface AutoinstallFileVersionProps {
  readonly id: number;
  readonly goBack: () => void;
  readonly version: number;
}

const AutoinstallFileVersion: FC<AutoinstallFileVersionProps> = ({
  id,
  goBack,
  version,
}) => {
  const { getAutoinstallFileQuery } = useAutoinstallFiles();

  const { data: { data: file } = { data: {} as AutoinstallFile }, isLoading } =
    getAutoinstallFileQuery({ id, version });

  const copyButtonProps = {
    children: (
      <>
        <Icon name="copy" />
        <span>Copy</span>
      </>
    ),
    onClick: (): void => {
      navigator.clipboard.writeText(file.contents);
      setButtonProps(copiedButtonProps);

      setTimeout(() => {
        setButtonProps(copyButtonProps);
      }, BUTTON_TIMEOUT);
    },
  };

  const copiedButtonProps = {
    children: (
      <>
        <Icon name="success-grey" />
        <span>Copied</span>
      </>
    ),
  };

  const [buttonProps, setButtonProps] =
    useState<ComponentProps<typeof Button>>(copyButtonProps);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className={classes.inputContainer}>
        <Input
          wrapperClassName={classes.inputWrapper}
          type="text"
          label="File name"
          value={file.filename.replace(/.yaml$/, "")}
          disabled
        />

        <span className={classes.inputDescription}>.yaml</span>
      </div>

      <InfoItem
        label="Date created"
        value={moment(file.created_at).format(DISPLAY_DATE_FORMAT)}
      />

      <CodeEditor
        label="Code"
        value={file.contents}
        options={{ readOnly: true }}
        language="yaml"
        headerContent={
          <Button
            className="u-no-margin--bottom"
            appearance="base"
            hasIcon
            {...buttonProps}
          />
        }
      />

      <div className={classes.buttons}>
        <Button
          hasIcon
          className="u-no-margin--bottom"
          type="button"
          appearance="base"
          onClick={goBack}
        >
          <Icon name="chevron-left" />
          <span>Back</span>
        </Button>
      </div>
    </>
  );
};

export default AutoinstallFileVersion;
