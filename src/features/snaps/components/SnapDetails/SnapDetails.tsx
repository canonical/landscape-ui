import Menu from "@/components/layout/Menu";
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
      <Menu
        items={[
          { label: "Name", size: 12, value: installedSnap.snap.name },
          {
            label: "Channel",
            size: 6,
            value: installedSnap.tracking_channel,
          },
          {
            label: "Version",
            size: 6,
            value: installedSnap.version,
          },
          {
            label: "Confinement",
            size: 6,
            value: installedSnap.confinement,
          },
          {
            label: "Held until",
            size: 6,
            value: moment(installedSnap.held_until).isValid()
              ? moment(installedSnap.held_until).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )
              : null,
          },
          {
            label: "Summary",
            size: 12,
            value: installedSnap.snap.summary,
          },
          {
            label: "Publisher",
            size: 12,
            value: installedSnap.snap.publisher.username,
          },
        ]}
      />
    </>
  );
};

export default SnapDetails;
