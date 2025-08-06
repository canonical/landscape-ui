import Grid from "@/components/layout/Grid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
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
      <Grid>
        <Grid.Item label="Name" size={12} value={installedSnap.snap.name} />

        <Grid.Item
          label="Channel"
          size={6}
          value={installedSnap.tracking_channel}
        />
        <Grid.Item label="Version" size={6} value={installedSnap.version} />

        <Grid.Item
          label="Confinement"
          size={6}
          value={installedSnap.confinement}
        />
        <Grid.Item
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

        <Grid.Item
          label="Summary"
          size={12}
          value={installedSnap.snap.summary}
        />

        <Grid.Item
          label="Publisher"
          size={12}
          value={installedSnap.snap.publisher.username}
        />
      </Grid>
    </>
  );
};

export default SnapDetails;
