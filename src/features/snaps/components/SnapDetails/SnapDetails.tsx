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
      <Menu>
        <Menu.Row>
          <Menu.Row.Item
            label="Name"
            size={12}
            value={installedSnap.snap.name}
          />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Channel"
            size={6}
            value={installedSnap.tracking_channel}
          />
          <Menu.Row.Item
            label="Version"
            size={6}
            value={installedSnap.version}
          />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Confinement"
            size={6}
            value={installedSnap.confinement}
          />
          <Menu.Row.Item
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
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Summary"
            size={12}
            value={installedSnap.snap.summary}
          />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Publisher"
            size={12}
            value={installedSnap.snap.publisher.username}
          />
        </Menu.Row>
      </Menu>
    </>
  );
};

export default SnapDetails;
