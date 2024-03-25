import { FC, SyntheticEvent, useState } from "react";
import { Button, Form, SearchBox } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import { usePackages } from "@/hooks/usePackages";
import LoadingState from "@/components/layout/LoadingState";
import PackageList from "@/pages/dashboard/instances/[single]/tabs/packages/PackageList";
import TablePagination from "@/components/layout/TablePagination";
import classes from "./PackagesInstallForm.module.scss";
import useSidePanel from "@/hooks/useSidePanel";
import { Package } from "@/types/Package";
import { Instance } from "@/types/Instance";

interface PackagesInstallFormProps {
  instance: Instance;
}

const PackagesInstallForm: FC<PackagesInstallFormProps> = ({ instance }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<Package[]>([]);
  const [searchText, setSearchText] = useState("");
  const [packageSearch, setPackageSearch] = useState("");

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelected([]);
  };

  const handlePageSize = (pageSize: number) => {
    setPageSize(pageSize);
    handlePaginate(1);
  };

  const handleSearch = (search = searchText) => {
    setPackageSearch(search);
    handlePaginate(1);
  };

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { getInstancePackagesQuery, installPackagesQuery } = usePackages();

  const {
    data: getInstancePackagesQueryResult,
    error: getInstancePackagesQueryError,
    isLoading: getInstancePackagesQueryLoading,
  } = getInstancePackagesQuery(
    {
      instance_id: instance.id,
      available: false,
      installed: true,
      upgrade: true,
      held: true,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: packageSearch,
    },
    { enabled: !!instance },
  );

  if (getInstancePackagesQueryError) {
    debug(getInstancePackagesQueryError);
  }

  const {
    mutateAsync: installPackages,
    isLoading: installPackagesQueryLoading,
  } = installPackagesQuery;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await installPackages({
        packages: selected.map(({ name }) => name),
        query: `id:${instance.id}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <SearchBox
          externallyControlled
          shouldRefocusAfterReset
          autocomplete="off"
          disabled={getInstancePackagesQueryLoading}
          value={searchText}
          onSearch={handleSearch}
          onChange={(inputValue) => {
            setSearchText(inputValue);
            handlePaginate(1);
          }}
          onClear={() => {
            setSearchText("");
            handleSearch("");
          }}
        />
      </Form>
      <Form onSubmit={handleSubmit} noValidate>
        {!packageSearch &&
          currentPage === 1 &&
          pageSize === 20 &&
          getInstancePackagesQueryLoading && <LoadingState />}

        {(packageSearch ||
          currentPage !== 1 ||
          pageSize !== 20 ||
          !getInstancePackagesQueryLoading) && (
          <PackageList
            instance={instance}
            packages={getInstancePackagesQueryResult?.data.results ?? []}
            packagesLoading={getInstancePackagesQueryLoading}
            selectedPackages={selected}
            onPackagesSelect={(packageNames) => {
              setSelected(packageNames);
            }}
            short
            emptyMsg={`No available packages found${
              packageSearch ? ` with the search "${packageSearch}"` : ""
            }`}
          />
        )}
        <TablePagination
          currentPage={currentPage}
          totalItems={getInstancePackagesQueryResult?.data.count}
          paginate={handlePaginate}
          pageSize={pageSize}
          setPageSize={handlePageSize}
          className={classes.pagination}
        />
        <div className={classes.buttons}>
          <Button
            type="button"
            appearance="positive"
            disabled={
              installPackagesQueryLoading || getInstancePackagesQueryLoading
            }
            onClick={handleSubmit}
            className="u-no-margin--bottom"
          >
            Install packages
          </Button>
          <Button
            type="button"
            onClick={closeSidePanel}
            disabled={installPackagesQueryLoading}
            className="u-no-margin--bottom"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
};

export default PackagesInstallForm;
