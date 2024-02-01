import { FC, SyntheticEvent, useState } from "react";
import { Button, Form, SearchBox } from "@canonical/react-components";
import useDebug from "../../../../../../hooks/useDebug";
import { usePackages } from "../../../../../../hooks/usePackages";
import LoadingState from "../../../../../../components/layout/LoadingState";
import PackageList from "./PackageList";
import TablePagination from "../../../../../../components/layout/TablePagination";
import classes from "./PackagesInstallForm.module.scss";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import { Package } from "../../../../../../types/Package";

interface PackagesInstallFormProps {
  query: string;
}

const PackagesInstallForm: FC<PackagesInstallFormProps> = ({ query }) => {
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

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { getPackagesQuery, installPackagesQuery } = usePackages();

  const {
    data: getPackagesQueryResult,
    isLoading: getPackagesQueryLoading,
    error: getPackagesQueryError,
  } = getPackagesQuery({
    query,
    available: true,
    installed: false,
    upgrade: false,
    held: false,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: packageSearch,
  });

  if (getPackagesQueryError) {
    debug(getPackagesQueryError);
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
        query,
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
          setPackageSearch(searchText);
        }}
      >
        <SearchBox
          externallyControlled
          shouldRefocusAfterReset
          value={searchText}
          onSearch={() => {
            setPackageSearch(searchText);
          }}
          onChange={(inputValue) => {
            setSearchText(inputValue);
          }}
          onClear={() => {
            setSearchText("");
            setPackageSearch("");
          }}
          autocomplete="off"
        />
      </Form>
      {getPackagesQueryLoading ? (
        <LoadingState />
      ) : (
        <PackageList
          packages={getPackagesQueryResult?.data.results ?? []}
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
        totalItems={getPackagesQueryResult?.data.count}
        paginate={handlePaginate}
        pageSize={pageSize}
        setPageSize={handlePageSize}
        className={classes.pagination}
      />

      <div className={classes.buttons}>
        <Button
          type="button"
          appearance="positive"
          disabled={installPackagesQueryLoading}
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
    </>
  );
};

export default PackagesInstallForm;
