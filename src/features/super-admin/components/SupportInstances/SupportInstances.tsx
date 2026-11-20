import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import {
  getInstanceListParams,
  isFilteringInstances,
} from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import { Notification } from "@canonical/react-components";
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

  // A failed request keeps the search and filters, so the query that failed
  // can be changed.
  if (staffInstancesError) {
    return (
      <>
        <SupportInstancesHeader name={name} />
        <Notification severity="negative" title="Could not load the instances">
          {staffInstancesError.response?.data.message ??
            staffInstancesError.message}
        </Notification>
      </>
    );
  }

  if (
    !isGettingStaffInstances &&
    !staffInstancesCount &&
    !isFilteringInstances({ ...filters, wsl })
  ) {
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
