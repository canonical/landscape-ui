import InfoItem from "@/components/layout/InfoItem";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Col, Row } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import type { AutoinstallFile } from "../../types";

interface AutoinstallFileInfoProps {
  readonly file: AutoinstallFile;
}

const AutoinstallFileInfo: FC<AutoinstallFileInfoProps> = ({ file }) => {
  return (
    <>
      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Name" value={file.filename} />
        </Col>

        <Col size={6}>
          <InfoItem label="Version" value={file.version} />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem
            label="Last modified"
            value={moment(file.last_modified_at).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        </Col>

        <Col size={6}>
          <InfoItem
            label="Date created"
            value={moment(file.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
          />
        </Col>
      </Row>
    </>
  );
};

export default AutoinstallFileInfo;
