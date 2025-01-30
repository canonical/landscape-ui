import InfoItem from "@/components/layout/InfoItem";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Col, Row } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import type { InstalledSnap } from "../../types";
import SnapsActions from "../SnapsActions";

interface SnapDetailsProps {
  readonly installedSnap: InstalledSnap;
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
              moment(installedSnap.held_until).isValid() ? (
                moment(installedSnap.held_until).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )
              ) : (
                <NoData />
              )
            }
          />
        </Col>
        <Col size={12}>
          <InfoItem
            label="summary"
            value={installedSnap.snap.summary ?? <NoData />}
          />
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
