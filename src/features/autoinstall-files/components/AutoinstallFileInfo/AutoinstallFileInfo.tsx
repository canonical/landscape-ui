import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import type { FC } from "react";
import type { AutoinstallFile } from "../../types";

interface AutoinstallFileInfoProps {
  readonly file: AutoinstallFile;
}

const AutoinstallFileInfo: FC<AutoinstallFileInfoProps> = ({ file }) => (
  <InfoGrid>
    <InfoGrid.Item label="Name" size={6} value={file.filename} />

    <InfoGrid.Item label="Version" size={6} value={file.version} />

    <InfoGrid.Item
      label="Last modified"
      size={6}
      value={moment(file.last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}
    />

    <InfoGrid.Item
      label="Date created"
      size={6}
      value={moment(file.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
    />
  </InfoGrid>
);

export default AutoinstallFileInfo;
