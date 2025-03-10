import CodeEditor from "@/components/form/CodeEditor";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import { Button, Icon, Input } from "@canonical/react-components";
import moment from "moment";
import { useState, type FC } from "react";
import { useGetAutoinstallFile } from "../../api";
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
  const { autoinstallFile } = useGetAutoinstallFile(id, { version });

  const copyButtonProps = {
    children: (
      <>
        <Icon name="copy" />
        <span>Copy</span>
      </>
    ),
    onClick: (file: AutoinstallFile): void => {
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
    onClick: (_: AutoinstallFile): void => undefined,
  };

  const [buttonProps, setButtonProps] = useState<{
    children: JSX.Element;
    onClick: (file: AutoinstallFile) => void;
  }>(copyButtonProps);

  if (!autoinstallFile) {
    return <LoadingState />;
  }

  return (
    <>
      <Input
        type="text"
        label="File name"
        value={autoinstallFile.filename}
        disabled
      />

      <InfoItem
        label="Date created"
        value={moment(autoinstallFile.created_at).format(DISPLAY_DATE_FORMAT)}
      />

      <CodeEditor
        label="Code"
        value={autoinstallFile.contents}
        options={{ readOnly: true }}
        language="yaml"
        headerContent={
          <Button
            className="u-no-margin--bottom"
            appearance="base"
            hasIcon
            onClick={() => {
              buttonProps.onClick(autoinstallFile);
            }}
          >
            {buttonProps.children}
          </Button>
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
