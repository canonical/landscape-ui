import { useSnaps } from "@/hooks/useSnaps";
import { Button } from "@canonical/react-components";
import { FC, useMemo, useState } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import useSidePanel from "@/hooks/useSidePanel";
import { InstallSnaps, SnapsHeader, SnapsList } from "@/features/snaps";
import { usePageParams } from "@/hooks/usePageParams";
import { useParams } from "react-router-dom";

const SnapsPanel: FC = () => {
  const [selectedSnapIds, setSelectedSnapIds] = useState<string[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams();
  const { search, currentPage, pageSize } = usePageParams();
  const { getSnapsQuery } = useSnaps();
  const { setSidePanelContent } = useSidePanel();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { data: getSnapsQueryResult, isLoading } = getSnapsQuery({
    instance_id: instanceId,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  const handleEmptyStateInstall = () => {
    setSidePanelContent("Install snap", <InstallSnaps />);
  };

  const installedSnaps = useMemo(
    () => getSnapsQueryResult?.data?.results ?? [],
    [getSnapsQueryResult],
  );

  const handleClearSelection = () => {
    setSelectedSnapIds([]);
  };

  return (
    <>
      {!search && isLoading && currentPage === 1 && pageSize === 20 && (
        <LoadingState />
      )}
      {!isLoading &&
        !search &&
        (!getSnapsQueryResult ||
          getSnapsQueryResult.data.results.length === 0) && (
          <EmptyState
            title="You haven't installed any snaps yet"
            body={
              <p className="u-no-margin--bottom">
                Install Snaps by clicking the button below.
              </p>
            }
            cta={[
              <Button
                appearance="positive"
                key="empty-state-install-snap"
                onClick={handleEmptyStateInstall}
              >
                Install Snap
              </Button>,
            ]}
          />
        )}
      {(search ||
        currentPage !== 1 ||
        pageSize !== 20 ||
        (getSnapsQueryResult &&
          getSnapsQueryResult?.data.results.length > 0)) && (
        <>
          <SnapsHeader
            selectedSnapIds={selectedSnapIds}
            installedSnaps={installedSnaps}
            handleClearSelection={handleClearSelection}
          />
          <SnapsList
            selectedSnapIds={selectedSnapIds}
            setSelectedSnapIds={(items) => setSelectedSnapIds(items)}
            installedSnaps={installedSnaps}
            isSnapsLoading={isLoading}
          />
        </>
      )}
      <TablePagination
        handleClearSelection={handleClearSelection}
        totalItems={getSnapsQueryResult?.data?.count}
        currentItemCount={getSnapsQueryResult?.data?.results.length}
      />
    </>
  );
};

export default SnapsPanel;
