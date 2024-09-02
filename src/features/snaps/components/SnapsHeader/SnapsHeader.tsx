import { FC } from "react";
import SnapsActions from "../SnapsActions";
import { InstalledSnap } from "@/types/Snap";
import { getSelectedSnaps } from "../../helpers";
import classes from "./SnapsHeader.module.scss";
import { usePageParams } from "@/hooks/usePageParams";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";

interface SnapsHeaderProps {
  handleClearSelection: () => void;
  selectedSnapIds: string[];
  installedSnaps: InstalledSnap[];
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
