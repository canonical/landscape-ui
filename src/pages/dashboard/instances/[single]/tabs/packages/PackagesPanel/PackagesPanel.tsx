import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import type { InstancePackage } from "@/features/packages";
import {
  PackageList,
  PackagesInstallButton,
  PackagesPanelHeader,
  usePackages,
} from "@/features/packages";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useLocation, useParams } from "react-router";
import { getEmptyMessage } from "./helpers";

const PackagesPanel: FC = () => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { status, search, currentPage, pageSize } = usePageParams();
  const { getInstancePackagesQuery } = usePackages();
  const { state } = useLocation() as {
    state: { selectAll?: boolean } | null;
  };

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const {
    data: unfilteredPackagesResponse,
    isPending: isGettingUnfilteredPackages,
    error: unfilteredPackagesError,
  } = getInstancePackagesQuery({
    limit: 1,
    instance_id: instanceId,
    installed: true,
  });

  const {
    data: packagesResponse,
    isPending: isGettingPackages,
    error: packagesError,
  } = getInstancePackagesQuery({
    instance_id: instanceId,
    search: search,
    limit: pageSize,
    offset: currentPage * pageSize - pageSize,
    installed: !status || undefined,
    upgrade: status === "upgrade" || undefined,
    held: status === "held" || undefined,
    security: status === "security" || undefined,
  });

  const { selectedItems: selected, setSelectedItems: setSelected } =
    useSelection<InstancePackage>(
      packagesResponse?.data.results ?? [],
      isGettingPackages,
    );

  const handleClearSelection = (): void => {
    setSelected([]);
  };

  if (isGettingUnfilteredPackages) {
    return <LoadingState />;
  }

  if (unfilteredPackagesError) {
    throw unfilteredPackagesError;
  }

  if (!unfilteredPackagesResponse.data.count) {
    return (
      <EmptyState
        title="No packages have been found yet."
        cta={[<PackagesInstallButton key="install" appearance="positive" />]}
      />
    );
  }

  if (packagesError) {
    throw packagesError;
  }

  return (
    <>
      <PackagesPanelHeader
        selectedPackages={selected}
        handleClearSelection={handleClearSelection}
      />

      {isGettingPackages ? (
        <LoadingState />
      ) : (
        <>
          <PackageList
            packages={packagesResponse.data.results}
            packagesLoading={isGettingPackages}
            selectedPackages={selected}
            onPackagesSelect={(packageNames) => {
              setSelected(packageNames);
            }}
            emptyMsg={getEmptyMessage(status, search)}
            selectAll={!!state?.selectAll}
          />
          <TablePagination
            handleClearSelection={handleClearSelection}
            totalItems={packagesResponse.data.count}
            currentItemCount={packagesResponse.data.results.length}
          />
        </>
      )}
    </>
  );
};

export default PackagesPanel;
