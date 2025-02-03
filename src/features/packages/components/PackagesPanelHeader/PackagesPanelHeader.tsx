import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import type { InstancePackage } from "../../types";
import PackageActions from "../PackageActions";
import { STATUS_OPTIONS } from "./constants";
import classes from "./PackagesPanelHeader.module.scss";

interface PackagesPanelHeaderProps {
  readonly handleClearSelection: () => void;
  readonly selectedPackages: InstancePackage[];
}

const PackagesPanelHeader: FC<PackagesPanelHeaderProps> = ({
  handleClearSelection,
  selectedPackages,
}) => {
  return (
    <>
      <HeaderWithSearch
        afterSearch={handleClearSelection}
        actions={
          <div className={classes.actions}>
            <StatusFilter options={STATUS_OPTIONS} />
            <PackageActions selectedPackages={selectedPackages} />
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["search", "status"]}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
};

export default PackagesPanelHeader;
