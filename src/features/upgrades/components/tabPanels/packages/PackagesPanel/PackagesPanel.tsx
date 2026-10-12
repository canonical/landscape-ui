import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import type { InstancePackagesToExclude, Package } from "@/features/packages";
import { usePackages } from "@/features/packages";
import type { Instance } from "@/types/Instance";
import AffectedPackages from "../AffectedPackages";

interface PackagesPanelProps {
  readonly excludedPackages: InstancePackagesToExclude[];
  readonly instances: Instance[];
  readonly onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
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

  const { getPackageUpgradesQuery } = usePackages();

  const {
    data: getPackageUpgradesQueryResult,
    isLoading: getPackageUpgradesQueryLoading,
  } = getPackageUpgradesQuery({
    computer_query: `id:${instances.map(({ id }) => id).join(" OR id:")}`,
    limit: 5,
    offset,
  });

  useEffect(() => {
    if (!getPackageUpgradesQueryResult || offset === offsetRef.current) {
      return;
    }

    totalPackageCountRef.current = getPackageUpgradesQueryResult.data.count;
    offsetRef.current = offset;
    setPackages((prevState) => [
      ...prevState,
      ...getPackageUpgradesQueryResult.data.results,
    ]);
  }, [getPackageUpgradesQueryResult]);

  return getPackageUpgradesQueryLoading && !packages.length ? (
    <LoadingState />
  ) : (
    <AffectedPackages
      excludedPackages={excludedPackages}
      hasNoMoreItems={getPackageUpgradesQueryResult?.data.next === null}
      isPackagesLoading={getPackageUpgradesQueryLoading}
      onExcludedPackagesChange={onExcludedPackagesChange}
      onTableLimitChange={() => {
        setOffset((prevState) => prevState + 5);
      }}
      packages={packages}
      totalPackageCount={totalPackageCountRef.current}
    />
  );
};

export default PackagesPanel;
