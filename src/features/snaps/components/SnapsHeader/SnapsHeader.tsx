import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import type { InstalledSnap } from "../../types";
import SnapsActions from "../SnapsActions";
import classes from "./SnapsHeader.module.scss";

interface SnapsHeaderProps {
  readonly handleClearSelection: () => void;
  readonly instanceTitle: string;
  readonly selectedSnaps: InstalledSnap[];
}

const SnapsHeader: FC<SnapsHeaderProps> = ({
  handleClearSelection,
  instanceTitle,
  selectedSnaps,
}) => {
  return (
    <HeaderWithSearch
      afterSearch={handleClearSelection}
      actions={
        <div className={classes.actions}>
          <SnapsActions
            instanceTitle={instanceTitle}
            selectedSnaps={selectedSnaps}
          />
        </div>
      }
    />
  );
};

export default SnapsHeader;
