import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";
import { FC } from "react";
import { getSelectedSnaps } from "../../helpers";
import { InstalledSnap } from "../../types";
import SnapsActions from "../SnapsActions";
import classes from "./SnapsHeader.module.scss";

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
