import classNames from "classnames";
import { FC, lazy, Suspense, useState } from "react";
import { Button, Col, Row } from "@canonical/react-components";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import PackageProfileDetailsConstraintsInfo from "@/features/package-profiles/PackageProfileDetailsConstraintsInfo";
import { usePackageProfiles } from "@/features/package-profiles/hooks";
import { PackageProfile } from "@/features/package-profiles/types";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./PackageProfileDetailsConstraints.module.scss";

const PackageProfileConstraintsEditForm = lazy(
  () => import("@/features/package-profiles/PackageProfileConstraintsEditForm"),
);

interface PackageProfileDetailsConstraintsProps {
  profile: PackageProfile;
}

const PackageProfileDetailsConstraints: FC<
  PackageProfileDetailsConstraintsProps
> = ({ profile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");

  const { setSidePanelContent } = useSidePanel();
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
    setSidePanelContent(
      `Change "${profile.name}" profile's constraints`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
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
          <Row
            className={classNames(
              "u-no-padding--left u-no-padding--right",
              classes.actions,
            )}
          >
            <Col size={6}>
              <HeaderWithSearch
                onSearch={(searchText) => setSearch(searchText)}
              />
            </Col>

            <Col size={6} className="u-align-text--right">
              <Button type="button" onClick={handlePackageConstraintsChange}>
                Change package constraints
              </Button>
            </Col>
          </Row>

          <PackageProfileDetailsConstraintsInfo
            isConstraintsLoading={getPackageProfileConstraintsQueryLoading}
            profileConstraints={
              getPackageProfileConstraintsQueryResult?.data.results
            }
            search={search}
          />

          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            paginate={(page) => setCurrentPage(page)}
            setPageSize={(itemsNumber) => setPageSize(itemsNumber)}
            totalItems={getPackageProfileConstraintsQueryResult?.data.count}
          />
        </>
      )}
    </>
  );
};

export default PackageProfileDetailsConstraints;
