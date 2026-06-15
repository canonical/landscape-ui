import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import { getSelectedSnaps } from "../../helpers";
import type { InstalledSnap } from "../../types";
import SnapsActions from "../SnapsActions";
import classes from "./SnapsHeader.module.scss";

interface SnapsHeaderProps {
  readonly handleClearSelection: () => void;
  readonly selectedSnapIds: string[];
  readonly installedSnaps: InstalledSnap[];
}

const SnapsHeader: FC<SnapsHeaderProps> = ({
  handleClearSelection,
  selectedSnapIds,
  installedSnaps,
}) => {
  return (
    <HeaderWithSearch
      afterSearch={handleClearSelection}
      actions={
        <div className={classes.actions}>
          <SnapsActions
            selectedSnapIds={selectedSnapIds}
            installedSnaps={getSelectedSnaps(installedSnaps, selectedSnapIds)}
          />
        </div>
      }
    />
  );
};

export default SnapsHeader;
