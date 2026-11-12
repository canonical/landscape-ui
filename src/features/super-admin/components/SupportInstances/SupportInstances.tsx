import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { getInstanceListParams } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useMemo } from "react";
import { useGetStaffInstances } from "../../api";
import SupportInstancesHeader from "./SupportInstancesHeader";
import SupportInstancesList from "./SupportInstancesList";

interface SupportInstancesProps {
  /** The account whose instances are listed. */
  readonly name: string;
}

/** The read-only instance list of the account named `name`. */
const SupportInstances: FC<SupportInstancesProps> = ({ name }) => {
  const { currentPage, pageSize, wsl, ...filters } = usePageParams();

  const listParams = useMemo(
    () => getInstanceListParams({ filters, wsl }),
    [filters, wsl],
  );

  const {
    staffInstances,
    staffInstancesCount,
    staffInstancesError,
    isGettingStaffInstances,
  } = useGetStaffInstances(name, {
    ...listParams,
    with_alerts: true,
    with_release_upgrades: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  if (staffInstancesError) {
    throw staffInstancesError;
  }

  const isFiltering =
    !!filters.query ||
    !!filters.status ||
    !!filters.os ||
    !!filters.contractExpiryDays ||
    filters.accessGroups.length > 0 ||
    filters.availabilityZones.length > 0 ||
    filters.tags.length > 0 ||
    filters.upgrades.length > 0 ||
    wsl.length > 0;

  if (!isGettingStaffInstances && !staffInstancesCount && !isFiltering) {
    return (
      <EmptyState title="This account has no instances." icon="connected" />
    );
  }

  return (
    <>
      <SupportInstancesHeader name={name} />
      {isGettingStaffInstances ? (
        <LoadingState />
      ) : (
        <SupportInstancesList name={name} instances={staffInstances} />
      )}
      <TablePagination
        totalItems={staffInstancesCount}
        currentItemCount={staffInstances.length}
      />
    </>
  );
};

export default SupportInstances;
