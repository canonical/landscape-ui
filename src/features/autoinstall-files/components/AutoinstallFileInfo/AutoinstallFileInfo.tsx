import Menu from "@/components/layout/Menu";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import type { FC } from "react";
import type { AutoinstallFile } from "../../types";

interface AutoinstallFileInfoProps {
  readonly file: AutoinstallFile;
}

const AutoinstallFileInfo: FC<AutoinstallFileInfoProps> = ({ file }) => (
  <Menu>
    <Menu.Row>
      <Menu.Row.Item label="Name" size={6} value={file.filename} />
      <Menu.Row.Item label="Version" size={6} value={file.version} />
    </Menu.Row>

    <Menu.Row>
      <Menu.Row.Item
        label="Last modified"
        size={6}
        value={moment(file.last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}
      />
      <Menu.Row.Item
        label="Date created"
        size={6}
        value={moment(file.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
      />
    </Menu.Row>
  </Menu>
);

export default AutoinstallFileInfo;
