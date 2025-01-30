import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";
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
  const { setPageParams } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
    handleClearSelection();
  };

  return (
    <HeaderWithSearch
      onSearch={handleSearch}
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
