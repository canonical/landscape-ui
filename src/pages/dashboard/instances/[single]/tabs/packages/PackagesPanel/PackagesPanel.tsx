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
import { getEmptyMessage } from "./helpers";

const PackagesPanel: FC = () => {
  const [selected, setSelected] = useState<InstancePackage[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { status, search, currentPage, pageSize } = usePageParams();
  const { getInstancePackagesQuery } = usePackages();
  const { state } = useLocation() as { state: { selectAll?: boolean } };

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const handleClearSelection = () => {
    setSelected([]);
  };

  const {
    data: getInstancePackagesQueryResult,
    isLoading: getInstancePackagesQueryLoading,
  } = getInstancePackagesQuery({
    instance_id: instanceId,
    search: search,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    installed: !status || undefined,
    upgrade: status === "upgrade" || undefined,
    held: status === "held" || undefined,
    security: status === "security" || undefined,
  });

  return (
    <>
      {!search &&
        !status &&
        currentPage === 1 &&
        pageSize === 20 &&
        getInstancePackagesQueryLoading && <LoadingState />}

      {(search ||
        status ||
        currentPage !== 1 ||
        pageSize !== 20 ||
        !getInstancePackagesQueryLoading) && (
        <>
          <PackagesPanelHeader
            selectedPackages={selected}
            handleClearSelection={handleClearSelection}
          />
          <PackageList
            packages={getInstancePackagesQueryResult?.data.results ?? []}
            packagesLoading={getInstancePackagesQueryLoading}
            selectedPackages={selected}
            onPackagesSelect={(packageNames) => {
              setSelected(packageNames);
            }}
            emptyMsg={getEmptyMessage(status, search)}
            selectAll={state?.selectAll ?? false}
          />
        </>
      )}
      <TablePagination
        handleClearSelection={handleClearSelection}
        totalItems={getInstancePackagesQueryResult?.data.count}
        currentItemCount={getInstancePackagesQueryResult?.data.results.length}
      />
    </>
  );
};

export default PackagesPanel;
