import type { FC } from "react";
import { Select } from "@canonical/react-components";
import usePageParams from "@/hooks/usePageParams";
import type { InstancePackage } from "../../types";
import PackageActions from "../PackageActions";
import { filterOptions } from "./constants";
import classes from "./PackagesPanelHeader.module.scss";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";

interface PackagesPanelHeaderProps {
  readonly handleClearSelection: () => void;
  readonly selectedPackages: InstancePackage[];
}

const PackagesPanelHeader: FC<PackagesPanelHeaderProps> = ({
  handleClearSelection,
  selectedPackages,
}) => {
  const { setPageParams, status } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
    handleClearSelection();
  };

  const handleFilterChange = (newStatus: string) => {
    setPageParams({ status: newStatus });
    handleClearSelection();
  };

  return (
    <HeaderWithSearch
      onSearch={handleSearch}
      actions={
        <div className={classes.actions}>
          <Select
            label="Status"
            wrapperClassName={classes.selectContainer}
            options={filterOptions}
            value={status}
            onChange={(event) => handleFilterChange(event.target.value)}
          />
          <PackageActions selectedPackages={selectedPackages} />
        </div>
      }
    />
  );
};

export default PackagesPanelHeader;
