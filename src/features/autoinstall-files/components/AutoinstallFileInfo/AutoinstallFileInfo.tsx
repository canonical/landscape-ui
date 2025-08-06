import Grid from "@/components/layout/Grid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import type { FC } from "react";
import type { AutoinstallFile } from "../../types";

interface AutoinstallFileInfoProps {
  readonly file: AutoinstallFile;
}

const AutoinstallFileInfo: FC<AutoinstallFileInfoProps> = ({ file }) => (
  <Grid>
    <Grid.Item label="Name" size={6} value={file.filename} />

    <Grid.Item label="Version" size={6} value={file.version} />

    <Grid.Item
      label="Last modified"
      size={6}
      value={moment(file.last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}
    />

    <Grid.Item
      label="Date created"
      size={6}
      value={moment(file.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
    />
  </Grid>
);

export default AutoinstallFileInfo;
