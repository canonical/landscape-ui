import { FC, useEffect, useRef, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  Package,
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
  const [packages, setPackages] = useState<Package[]>([]);
  const [offset, setOffset] = useState(0);

  const totalPackageCountRef = useRef(0);
  const offsetRef = useRef(-1);

  const { getPackagesQuery } = usePackages();

  const { data: getPackagesQueryResult, isLoading: getPackagesQueryLoading } =
    getPackagesQuery({
      query: `id:${instances.map(({ id }) => id).join(" OR id:")}`,
      upgrade: true,
      limit: 5,
      offset,
    });

  useEffect(() => {
    if (!getPackagesQueryResult || offset === offsetRef.current) {
      return;
    }

    totalPackageCountRef.current = getPackagesQueryResult.data.count;
    offsetRef.current = offset;
    setPackages((prevState) => [
      ...prevState,
      ...getPackagesQueryResult.data.results,
    ]);
  }, [getPackagesQueryResult]);

  return getPackagesQueryLoading && !packages.length ? (
    <LoadingState />
  ) : (
    <AffectedPackages
      excludedPackages={excludedPackages}
      instances={instances}
      isPackagesLoading={getPackagesQueryLoading}
      onExcludedPackagesChange={onExcludedPackagesChange}
      onTableLimitChange={() => setOffset((prevState) => prevState + 5)}
      packages={packages}
      totalPackageCount={totalPackageCountRef.current}
    />
  );
};

export default PackagesPanel;
