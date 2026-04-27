import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import type { FC } from "react";
import { useState } from "react";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";
import PackageProfileDetailsConstraintsInfo from "../PackageProfileDetailsConstraintsInfo";

interface PackageProfileDetailsConstraintsProps {
  readonly profile: PackageProfile;
}

const PackageProfileDetailsConstraints: FC<
  PackageProfileDetailsConstraintsProps
> = ({ profile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");

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

  return (
    <>
      {!search &&
        currentPage === 1 &&
        pageSize === DEFAULT_PAGE_SIZE &&
        getPackageProfileConstraintsQueryLoading && <LoadingState />}

      {(search ||
        currentPage !== 1 ||
        pageSize !== DEFAULT_PAGE_SIZE ||
        (!getPackageProfileConstraintsQueryLoading &&
          getPackageProfileConstraintsQueryResult &&
          getPackageProfileConstraintsQueryResult.data.results.length > 0)) && (
        <>
          <HeaderWithSearch onSearch={setSearch} searchText={search} />

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
            paginate={setCurrentPage}
            setPageSize={setPageSize}
            totalItems={getPackageProfileConstraintsQueryResult?.data.count}
          />
        </>
      )}
    </>
  );
};

export default PackageProfileDetailsConstraints;
