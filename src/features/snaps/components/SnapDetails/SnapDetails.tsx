import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import type { FC } from "react";
import type { InstalledSnap } from "../../types";
import SnapsActions from "../SnapsActions";

interface SnapDetailsProps {
  readonly installedSnap: InstalledSnap;
}

const SnapDetails: FC<SnapDetailsProps> = ({ installedSnap }) => {
  return (
    <>
      <SnapsActions selectedSnaps={[installedSnap]} sidePanel />
      <InfoGrid spaced>
        <InfoGrid.Item label="Name" large value={installedSnap.snap.name} />

        <InfoGrid.Item label="Channel" value={installedSnap.tracking_channel} />
        <InfoGrid.Item label="Version" value={installedSnap.version} />

        <InfoGrid.Item label="Confinement" value={installedSnap.confinement} />
        <InfoGrid.Item
          label="Held until"
          value={
            date(installedSnap.held_until).isValid()
              ? date(installedSnap.held_until).format(DISPLAY_DATE_TIME_FORMAT)
              : null
          }
        />

        <InfoGrid.Item
          label="Summary"
          large
          value={installedSnap.snap.summary}
        />

        <InfoGrid.Item
          label="Publisher"
          large
          value={installedSnap.snap.publisher.username}
        />
      </InfoGrid>
    </>
  );
};

export default SnapDetails;
