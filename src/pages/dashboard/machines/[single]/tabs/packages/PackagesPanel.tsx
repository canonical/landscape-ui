import { FC, useEffect, useMemo, useState } from "react";
import TablePagination from "../../../../../../components/layout/TablePagination";
import { usePackages } from "../../../../../../hooks/usePackages";
import useDebug from "../../../../../../hooks/useDebug";
import LoadingState from "../../../../../../components/layout/LoadingState";
import PackageList from "./PackageList";
import PackagesPanelHeader from "./PackagesPanelHeader";
import { Package } from "../../../../../../types/Package";
import { useParams } from "react-router-dom";

interface PackagesPanelProps {
  tabState: { filter: string; selectAll: boolean } | null;
}

const PackagesPanel: FC<PackagesPanelProps> = ({ tabState }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selected, setSelected] = useState<Package[]>([]);
  const [packageSearch, setPackageSearch] = useState("");
  const [filter, setFilter] = useState("");

  const { hostname, childHostname } = useParams();

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

  const debug = useDebug();
  const { getPackagesQuery } = usePackages();

  const {
    data: getPackagesQueryResult,
    isLoading: getPackagesQueryLoading,
    error: getPackagesQueryError,
  } = getPackagesQuery(
    {
      query: `hostname:${childHostname ?? hostname}`,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      installed: filter === "installed" || undefined,
      upgrade: filter === "upgrade" || undefined,
      held: filter === "held" || undefined,
      search: packageSearch,
    },
    {
      enabled: !!hostname,
    },
  );

  if (getPackagesQueryError) {
    debug(getPackagesQueryError);
  }

  const emptyMessage = useMemo(() => {
    let message: string;

    if (filter === "") {
      message = "No packages found";
    } else if (filter === "upgrade") {
      message = "No available upgrades found";
    } else if (filter === "installed") {
      message = "No installed packages found";
    } else {
      message = "No held packages found";
    }

    return packageSearch
      ? `${message} with the search "${packageSearch}"`
      : message;
  }, [filter, packageSearch]);

  return (
    <>
      <PackagesPanelHeader
        query={`hostname:${hostname}`}
        selectedPackages={selected}
        filter={filter}
        onFilterChange={handleFilterChange}
        onPackageSearchChange={handlePackageSearchChange}
      />
      {getPackagesQueryLoading ? (
        <LoadingState />
      ) : (
        <PackageList
          packages={getPackagesQueryResult?.data.results ?? []}
          selectedPackages={selected}
          onPackagesSelect={(packageNames) => {
            setSelected(packageNames);
          }}
          machineHostname={hostname ?? ""}
          emptyMsg={emptyMessage}
          selectAll={tabState?.selectAll ?? false}
        />
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={getPackagesQueryResult?.data.count}
        paginate={(page) => {
          setCurrentPage(page);
        }}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        currentItemCount={getPackagesQueryResult?.data.results.length}
      />
    </>
  );
};

export default PackagesPanel;
