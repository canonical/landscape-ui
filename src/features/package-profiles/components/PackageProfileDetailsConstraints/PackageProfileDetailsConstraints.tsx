import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";
import PackageProfileDetailsConstraintsInfo from "../PackageProfileDetailsConstraintsInfo";
import classes from "./PackageProfileDetailsConstraints.module.scss";

interface PackageProfileDetailsConstraintsProps {
  readonly profile: PackageProfile;
}

const PackageProfileDetailsConstraints: FC<
  PackageProfileDetailsConstraintsProps
> = ({ profile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");

  const { setPageParams } = usePageParams();
  const { getPackageProfileConstraintsQuery } = usePackageProfiles();

  const {
    data: getPackageProfileConstraintsQueryResult,
    isLoading: getPackageProfileConstraintsQueryLoading,
  } = getPackageProfileConstraintsQuery({
    name: profile.name,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search,
  });

  const handlePackageConstraintsChange = () => {
    setPageParams({ action: "constraints" });
  };

  return (
    <>
      {!search &&
        currentPage === 1 &&
        pageSize === 20 &&
        getPackageProfileConstraintsQueryLoading && <LoadingState />}

      {(search ||
        currentPage !== 1 ||
        pageSize !== 20 ||
        (!getPackageProfileConstraintsQueryLoading &&
          getPackageProfileConstraintsQueryResult &&
          getPackageProfileConstraintsQueryResult.data.results.length > 0)) && (
        <>
          <HeaderWithSearch
            className={classes.actions}
            onSearch={(searchText) => {
              setSearch(searchText);
            }}
            actions={
              <Button
                className="u-no-margin--bottom"
                type="button"
                onClick={handlePackageConstraintsChange}
              >
                Change package constraints
              </Button>
            }
          />

          <PackageProfileDetailsConstraintsInfo
            isConstraintsLoading={getPackageProfileConstraintsQueryLoading}
            profileConstraints={
              getPackageProfileConstraintsQueryResult?.data.results
            }
            search={search}
          />

          <SidePanelTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            paginate={(page) => {
              setCurrentPage(page);
            }}
            setPageSize={(itemsNumber) => {
              setPageSize(itemsNumber);
            }}
            totalItems={getPackageProfileConstraintsQueryResult?.data.count}
          />
        </>
      )}
    </>
  );
};

export default PackageProfileDetailsConstraints;
