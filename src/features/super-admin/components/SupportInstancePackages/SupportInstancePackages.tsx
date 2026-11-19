import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { getEmptyMessage, getPackageSearchFilters } from "@/features/packages";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useGetStaffInstancePackages } from "../../api";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstancePackageList from "./SupportInstancePackageList";
import SupportInstancePackagesHeader from "./SupportInstancePackagesHeader";

const SupportInstancePackages: FC<SupportInstanceTabProps> = ({
  name,
  instance,
}) => {
  const { status, search, currentPage, pageSize } = usePageParams();

  const {
    staffInstancePackages,
    staffInstancePackagesCount,
    staffInstancePackagesError,
    isGettingStaffInstancePackages,
  } = useGetStaffInstancePackages(name, instance.id, {
    search,
    limit: pageSize,
    offset: currentPage * pageSize - pageSize,
    ...getPackageSearchFilters(status),
  });

  if (staffInstancePackagesError) {
    throw staffInstancePackagesError;
  }

  if (
    !isGettingStaffInstancePackages &&
    !(staffInstancePackagesCount || search || status)
  ) {
    return <EmptyState title="No packages have been found yet." />;
  }

  return (
    <>
      <SupportInstancePackagesHeader />
      {isGettingStaffInstancePackages ? (
        <LoadingState />
      ) : (
        <>
          <SupportInstancePackageList
            packages={staffInstancePackages}
            emptyMsg={getEmptyMessage(status, search)}
            ubuntuProPath={ROUTES.superAdmin.sessionInstanceFromInstance(
              name,
              instance,
              { tab: "ubuntu-pro" },
            )}
          />
          <TablePagination
            totalItems={staffInstancePackagesCount}
            currentItemCount={staffInstancePackages.length}
          />
        </>
      )}
    </>
  );
};

export default SupportInstancePackages;
