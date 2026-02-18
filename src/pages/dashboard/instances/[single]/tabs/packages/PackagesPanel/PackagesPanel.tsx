import { FC, useEffect, useState } from "react";
import TablePagination from "@/components/layout/TablePagination";
import { usePackages } from "@/hooks/usePackages";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import PackageList from "@/pages/dashboard/instances/[single]/tabs/packages/PackageList";
import PackagesPanelHeader from "@/pages/dashboard/instances/[single]/tabs/packages/PackagesPanelHeader";
import { Package } from "@/types/Package";
import { Instance } from "@/types/Instance";
import { emptyMessage } from "@/pages/dashboard/instances/[single]/tabs/packages/PackagesPanel/helpers";

interface PackagesPanelProps {
  instance: Instance;
  tabState: { filter: string; selectAll: boolean } | null;
}

const PackagesPanel: FC<PackagesPanelProps> = ({ instance, tabState }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<Package[]>([]);
  const [packageSearch, setPackageSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!tabState) {
      return;
    }

    handleFilterChange(tabState.filter);
  }, [tabState]);

  const handlePackageSearchChange = (searchText: string) => {
    setPackageSearch(searchText);
    setCurrentPage(1);
    setSelected([]);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
    setSelected([]);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const { getInstancePackagesQuery } = usePackages();

  const {
    data: getInstalledPackagesQueryResult,
    isLoading: getInstalledPackagesQueryLoading,
  } = getInstancePackagesQuery(
    {
      instance_id: instance.id,
      limit: 1,
      installed: true,
    },
    {
      enabled: !!instance,
    },
  );

  const {
    data: getInstancePackagesQueryResult,
    isLoading: getInstancePackagesQueryLoading,
  } = getInstancePackagesQuery(
    {
      instance_id: instance.id,
      search: packageSearch,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      available: false,
      installed: filter === "installed" || !filter || undefined,
      upgrade: filter === "upgrade" || undefined,
      held: filter === "held" || undefined,
      security: filter === "security" || undefined,
    },
    {
      enabled: !!instance,
    },
  );

  const hasInstalledPackages =
    (getInstalledPackagesQueryResult?.data.count ?? 0) > 0;

  return (
    <>
      {!packageSearch &&
        !filter &&
        currentPage === 1 &&
        pageSize === 20 &&
        (getInstancePackagesQueryLoading ||
          getInstalledPackagesQueryLoading) && <LoadingState />}

      {!getInstalledPackagesQueryLoading && !hasInstalledPackages && (
        <EmptyState title="No packages have been found yet." />
      )}

      {hasInstalledPackages &&
        (packageSearch ||
          filter ||
          currentPage !== 1 ||
          pageSize !== 20 ||
          !getInstancePackagesQueryLoading) && (
          <>
            <PackagesPanelHeader
              instance={instance}
              selectedPackages={selected}
              filter={filter}
              onFilterChange={handleFilterChange}
              onPackageSearchChange={handlePackageSearchChange}
            />
            <PackageList
              packages={getInstancePackagesQueryResult?.data.results ?? []}
              packagesLoading={getInstancePackagesQueryLoading}
              selectedPackages={selected}
              onPackagesSelect={(packageNames) => {
                setSelected(packageNames);
              }}
              instance={instance}
              emptyMsg={emptyMessage(filter, packageSearch)}
              selectAll={tabState?.selectAll ?? false}
            />
          </>
        )}
      <TablePagination
        currentPage={currentPage}
        totalItems={getInstancePackagesQueryResult?.data.count}
        paginate={(page) => {
          setCurrentPage(page);
        }}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        currentItemCount={getInstancePackagesQueryResult?.data.results.length}
      />
    </>
  );
};

export default PackagesPanel;
