import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import type { InstancePackage } from "@/features/packages";
import {
  PackageList,
  PackagesPanelHeader,
  usePackages,
} from "@/features/packages";
import usePageParams from "@/hooks/usePageParams";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import type { PackageOld } from "../../../../../../../features/packages/types/Package";
import { getEmptyMessage } from "./helpers";

const PackagesPanel: FC = () => {
  const [selected, setSelected] = useState<InstancePackage[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { status, search, currentPage, pageSize } = usePageParams();
  const { getInstancePackagesQueryOld } = usePackages();
  const { state } = useLocation() as {
    state: { selectAll?: boolean } | null;
  };

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const handleClearSelection = (): void => {
    setSelected([]);
  };

  const {
    data: { data: instancePackagesOld } = { data: [] as PackageOld[] },
    isLoading: getInstancePackagesQueryLoading,
  } = getInstancePackagesQueryOld({
    instance_id: instanceId,
    search: search,
    installed: !status || undefined,
    upgrade: status === "upgrade" || undefined,
    held: status === "held" || undefined,
  });

  const instancePackages: InstancePackage[] = instancePackagesOld.map(
    (instancePackageOld) => {
      return {
        id: instancePackageOld.id,
        name: instancePackageOld.name,
        summary: instancePackageOld.summary,
        available_version: !instancePackageOld.computers.upgrades.includes(
          instanceId,
        )
          ? instancePackageOld.version
          : "Upgrades available",
        current_version: instancePackageOld.version,
        status: instancePackageOld.computers.held.includes(instanceId)
          ? "held"
          : "installed",
      };
    },
  );

  return (
    <>
      {!search &&
      !status &&
      currentPage === 1 &&
      pageSize === 20 &&
      getInstancePackagesQueryLoading ? (
        <LoadingState />
      ) : (
        <>
          <PackagesPanelHeader
            selectedPackages={selected}
            handleClearSelection={handleClearSelection}
          />
          <PackageList
            packages={instancePackages.slice(
              currentPage * pageSize - pageSize,
              currentPage * pageSize,
            )}
            packagesLoading={getInstancePackagesQueryLoading}
            selectedPackages={selected}
            onPackagesSelect={(packageNames) => {
              setSelected(packageNames);
            }}
            emptyMsg={getEmptyMessage(status, search)}
            selectAll={!!state?.selectAll}
          />
        </>
      )}

      <TablePagination
        handleClearSelection={handleClearSelection}
        totalItems={instancePackages.length}
        currentItemCount={
          instancePackages.slice(
            currentPage * pageSize - pageSize,
            currentPage * pageSize,
          ).length
        }
      />
    </>
  );
};

export default PackagesPanel;
