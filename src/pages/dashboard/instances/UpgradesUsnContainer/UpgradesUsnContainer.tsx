import { FC } from "react";
import useDebug from "@/hooks/useDebug";
import useUsns from "@/hooks/useUsns";
import LoadingState from "@/components/layout/LoadingState";
import { UsnList } from "@/features/usns";

interface UpgradesUsnContainerProps {
  instanceIds: number[];
}

const UpgradesUsnContainer: FC<UpgradesUsnContainerProps> = ({
  instanceIds,
}) => {
  const debug = useDebug();
  const { getUsnsQuery } = useUsns();

  const {
    data: getUsnsQueryResult,
    isLoading: getUsnsQueryLoading,
    error: getUsnsQueryError,
  } = getUsnsQuery(
    { computer_ids: instanceIds, show_packages: false },
    { enabled: instanceIds.length > 0 },
  );

  if (getUsnsQueryError) {
    debug(getUsnsQueryError);
  }

  return (
    <>
      {getUsnsQueryLoading && <LoadingState />}
      {!getUsnsQueryLoading &&
        (!getUsnsQueryResult || getUsnsQueryResult.data.results.length === 0) &&
        null}
      {!getUsnsQueryLoading &&
        getUsnsQueryResult &&
        getUsnsQueryResult.data.results.length > 0 && (
          <UsnList
            tableType="expandable"
            instanceIds={instanceIds}
            isUsnsLoading={getUsnsQueryLoading}
            usns={getUsnsQueryResult.data.results}
          />
        )}
    </>
  );
};

export default UpgradesUsnContainer;
