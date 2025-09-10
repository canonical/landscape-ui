import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { type FC, useState } from "react";
import { useGetScriptProfileActivities } from "../../api";
import type { ScriptProfile } from "../../types";
import ScriptProfileActivitiesList from "../ScriptProfileActivitiesList";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

interface ScriptProfileActivityHistoryProps {
  readonly profile: ScriptProfile;
}

const ScriptProfileActivityHistory: FC<ScriptProfileActivityHistoryProps> = ({
  profile,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { activities, activitiesCount, isGettingActivities } =
    useGetScriptProfileActivities({
      id: profile.id,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  if (isGettingActivities) {
    return <LoadingState />;
  }

  if (!activities.length) {
    return (
      <EmptyState title="No runs found" body="The profile has not run yet." />
    );
  }

  return (
    <>
      <ScriptProfileActivitiesList activities={activities} />

      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={activitiesCount}
      />
    </>
  );
};

export default ScriptProfileActivityHistory;
