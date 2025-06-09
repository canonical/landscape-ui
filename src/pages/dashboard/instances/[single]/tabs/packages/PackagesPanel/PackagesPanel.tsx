import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import type { InstancePackage } from "@/features/packages";
import {
  PackageList,
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
  const {
    selectedItems: selected,
    setSelectedItems: setSelected,
    validate,
  } = useSelection<InstancePackage>();

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { status, search, currentPage, pageSize } = usePageParams();
  const { getInstancePackagesQuery } = usePackages();
  const { state } = useLocation() as {
    state: { selectAll?: boolean } | null;
  };

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const handleClearSelection = (): void => {
    setSelected([]);
  };

  const { data: packagesResponse, isLoading: isGettingPackages } =
    getInstancePackagesQuery({
      instance_id: instanceId,
      search: search,
      limit: pageSize,
      offset: currentPage * pageSize - pageSize,
      installed: !status || undefined,
      upgrade: status === "upgrade" || undefined,
      held: status === "held" || undefined,
      security: status === "security" || undefined,
    });

  const packages = packagesResponse?.data.results ?? [];

  validate(packages, isGettingPackages);

  return (
    <>
      {!search &&
      !status &&
      currentPage === 1 &&
      pageSize === 20 &&
      isGettingPackages ? (
        <LoadingState />
      ) : (
        <>
          <PackagesPanelHeader
            selectedPackages={selected}
            handleClearSelection={handleClearSelection}
          />
          <PackageList
            packages={packages}
            packagesLoading={isGettingPackages}
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
        totalItems={packagesResponse?.data.count}
        currentItemCount={packages.length}
      />
    </>
  );
};

export default PackagesPanel;
