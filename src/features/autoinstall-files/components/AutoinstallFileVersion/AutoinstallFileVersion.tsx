import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import { Input } from "@canonical/react-components";
import moment from "moment";
import { type FC } from "react";
import { useGetAutoinstallFile } from "../../api";
import {
  AUTOINSTALL_FILE_EXTENSION,
  AUTOINSTALL_FILE_LANGUAGE,
} from "../../constants";
import { removeAutoinstallFileExtension } from "../../helpers";
import classes from "./AutoinstallFileVersion.module.scss";

interface AutoinstallFileVersionProps {
  readonly fileId: number;
  readonly goBack: () => void;
  readonly version: number;
}

const AutoinstallFileVersion: FC<AutoinstallFileVersionProps> = ({
  fileId,
  goBack,
  version,
}) => {
  const { autoinstallFile, isAutoinstallFileLoading } = useGetAutoinstallFile({
    id: fileId,
    version,
  });

  if (isAutoinstallFileLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className={classes.inputContainer}>
        <Input
          wrapperClassName={classes.inputWrapper}
          type="text"
          label="File name"
          value={removeAutoinstallFileExtension(autoinstallFile.filename)}
          disabled
        />

        <span className={classes.inputDescription}>
          {AUTOINSTALL_FILE_EXTENSION}
        </span>
      </div>

      <InfoItem
        label="Date created"
        value={moment(autoinstallFile.created_at).format(DISPLAY_DATE_FORMAT)}
      />

      <CodeEditor
        label="Code"
        value={autoinstallFile.contents}
        options={{ readOnly: true }}
        language={AUTOINSTALL_FILE_LANGUAGE}
      />

      <SidePanelFormButtons
        hasActionButtons={false}
        hasBackButton
        onBackButtonPress={goBack}
      />
    </>
  );
};

export default AutoinstallFileVersion;
