import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import type { FC } from "react";
import type { InstalledSnap } from "../../types";
import SnapsActions from "../SnapsActions";
import classes from "./SnapDetails.module.scss";

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
      <InfoGrid className={classes.infoGrid}>
        <InfoGrid.Item label="Name" size={12} value={installedSnap.snap.name} />

        <InfoGrid.Item
          label="Channel"
          size={6}
          value={installedSnap.tracking_channel}
        />
        <InfoGrid.Item label="Version" size={6} value={installedSnap.version} />

        <InfoGrid.Item
          label="Confinement"
          size={6}
          value={installedSnap.confinement}
        />
        <InfoGrid.Item
          label="Held until"
          size={6}
          value={
            moment(installedSnap.held_until).isValid()
              ? moment(installedSnap.held_until).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )
              : null
          }
        />

        <InfoGrid.Item
          label="Summary"
          size={12}
          value={installedSnap.snap.summary}
        />

        <InfoGrid.Item
          label="Publisher"
          size={12}
          value={installedSnap.snap.publisher.username}
        />
      </InfoGrid>
    </>
  );
};

export default SnapDetails;
