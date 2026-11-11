import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { ActivitiesEmptyState } from "@/features/activities";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetStaffActivities } from "../../api";
import type { SupportInstanceTabProps } from "../../types";
import { getActivitiesQuery, isFiltering } from "./helpers";
import SupportInstanceActivitiesHeader from "./SupportInstanceActivitiesHeader";
import SupportInstanceActivitiesList from "./SupportInstanceActivitiesList";

/** The Activities tab of an instance in a support session: read-only. */
const SupportInstanceActivities: FC<SupportInstanceTabProps> = ({
  name,
  instance,
}) => {
  const { query, status, type, fromDate, toDate, currentPage, pageSize } =
    usePageParams();

  const filters = { query, status, type, fromDate, toDate };

  const {
    staffActivities,
    staffActivitiesCount,
    staffActivitiesError,
    isGettingStaffActivities,
  } = useGetStaffActivities(name, {
    query: getActivitiesQuery(instance.id, filters),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  if (staffActivitiesError) {
    throw staffActivitiesError;
  }

  if (
    !isGettingStaffActivities &&
    !staffActivitiesCount &&
    !isFiltering(filters)
  ) {
    return <ActivitiesEmptyState />;
  }

  return (
    <>
      <SupportInstanceActivitiesHeader name={name} />
      {isGettingStaffActivities ? (
        <LoadingState />
      ) : (
        <SupportInstanceActivitiesList
          name={name}
          activities={staffActivities}
        />
      )}
      <TablePagination
        totalItems={staffActivitiesCount}
        currentItemCount={staffActivities.length}
      />
    </>
  );
};

export default SupportInstanceActivities;
