import { FC } from "react";
import InfoItem from "../../../../components/layout/InfoItem";
import SnapsActions from "../SnapsActions";
import { InstalledSnap } from "@/types/Snap";
import { Col, Row } from "@canonical/react-components";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";

interface SnapDetailsProps {
  installedSnap: InstalledSnap;
}

const SnapDetails: FC<SnapDetailsProps> = ({ installedSnap }) => {
  return (
    <>
      <SnapsActions
        selectedSnapIds={[installedSnap.snap.id]}
        installedSnaps={[installedSnap]}
        sidePanel
      />
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={12}>
          <InfoItem label="snap name" value={installedSnap.snap.name} />
        </Col>
        <Col size={6}>
          <InfoItem label="channel" value={installedSnap.tracking_channel} />
        </Col>
        <Col size={6}>
          <InfoItem label="version" value={installedSnap.version} />
        </Col>
        <Col size={6}>
          <InfoItem label="confinement" value={installedSnap.confinement} />
        </Col>
        <Col size={6}>
          <InfoItem
            label="held until"
            value={
              installedSnap.held_until
                ? moment(installedSnap.held_until).format(
                    DISPLAY_DATE_TIME_FORMAT,
                  )
                : "-"
            }
          />
        </Col>
        <Col size={12}>
          <InfoItem label="summary" value={installedSnap.snap.summary ?? "-"} />
        </Col>
        <Col size={12}>
          <InfoItem
            label="publisher"
            value={installedSnap.snap.publisher.username}
          />
        </Col>
      </Row>
    </>
  );
};

export default SnapDetails;
