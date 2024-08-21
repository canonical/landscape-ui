import { FC, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  UpgradeInstancePackagesParams,
  usePackages,
} from "@/features/packages";
import { Instance } from "@/types/Instance";
import AffectedPackages from "../AffectedPackages";

interface PackagesPanelProps {
  excludedPackages: UpgradeInstancePackagesParams[];
  instances: Instance[];
  onExcludedPackagesChange: (
    newExcludedPackages: UpgradeInstancePackagesParams[],
  ) => void;
}

const PackagesPanel: FC<PackagesPanelProps> = ({
  excludedPackages,
  instances,
  onExcludedPackagesChange,
}) => {
  const [tableLimit, setTableLimit] = useState(5);

  const { getPackagesQuery } = usePackages();

  const { data: getPackagesQueryResult, isLoading: getPackagesQueryLoading } =
    getPackagesQuery({
      query: `id:${instances.map(({ id }) => id).join(" OR id:")}`,
      upgrade: true,
      limit: tableLimit,
    });

  return getPackagesQueryLoading ? (
    <LoadingState />
  ) : (
    <AffectedPackages
      excludedPackages={excludedPackages}
      instances={instances}
      onExcludedPackagesChange={onExcludedPackagesChange}
      onTableLimitChange={() => setTableLimit((prevState) => prevState + 5)}
      packages={getPackagesQueryResult?.data.results ?? []}
      totalPackageCount={getPackagesQueryResult?.data.count ?? 0}
    />
  );
};

export default PackagesPanel;
