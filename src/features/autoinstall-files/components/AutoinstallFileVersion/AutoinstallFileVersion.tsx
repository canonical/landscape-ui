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
import type { AutoinstallFile } from "../../types";
import type { AutoinstallFileVersionInfo } from "../../types/AutoinstallFile";
import classes from "./AutoinstallFileVersion.module.scss";

interface AutoinstallFileVersionProps {
  readonly file: AutoinstallFile;
  readonly goBack: () => void;
  readonly versionInfo: AutoinstallFileVersionInfo;
}

const AutoinstallFileVersion: FC<AutoinstallFileVersionProps> = ({
  file,
  goBack,
  versionInfo,
}) => {
  const { autoinstallFile, isAutoinstallFileLoading } = useGetAutoinstallFile({
    id: file.id,
    version: versionInfo.version,
  });

  return (
    <>
      <div className={classes.inputContainer}>
        <Input
          wrapperClassName={classes.inputWrapper}
          type="text"
          label="File name"
          value={removeAutoinstallFileExtension(file.filename)}
          disabled
        />

        <span className={classes.inputDescription}>
          {AUTOINSTALL_FILE_EXTENSION}
        </span>
      </div>

      <InfoItem
        label="Date created"
        value={moment(versionInfo.created_at).format(DISPLAY_DATE_FORMAT)}
      />

      {isAutoinstallFileLoading ? (
        <LoadingState />
      ) : (
        <CodeEditor
          label="Code"
          value={autoinstallFile?.contents}
          options={{ readOnly: true }}
          language={AUTOINSTALL_FILE_LANGUAGE}
        />
      )}

      <SidePanelFormButtons
        hasActionButtons={false}
        hasBackButton
        onBackButtonPress={goBack}
      />
    </>
  );
};

export default AutoinstallFileVersion;
