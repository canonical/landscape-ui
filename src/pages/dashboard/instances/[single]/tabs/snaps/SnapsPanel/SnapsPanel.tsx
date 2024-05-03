import { useSnaps } from "@/hooks/useSnaps";
import { Button } from "@canonical/react-components";
import { FC, useMemo, useState } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import useSidePanel from "@/hooks/useSidePanel";
import { InstallSnaps, SnapsHeader, SnapsList } from "@/features/snaps";

interface SnapsProps {
  instanceId: number;
}

const SnapsPanel: FC<SnapsProps> = ({ instanceId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedSnapIds, setSelectedSnapIds] = useState<string[]>([]);
  const [snapsSearch, setSnapsSearch] = useState("");

  const { getSnapsQuery } = useSnaps();
  const { setSidePanelContent } = useSidePanel();
  const { data: getSnapsQueryResult, isLoading } = getSnapsQuery({
    instance_id: instanceId,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: snapsSearch,
  });

  const handleSnapsSearchChange = (searchText: string) => {
    setSnapsSearch(searchText);
    setCurrentPage(1);
    setSelectedSnapIds([]);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleEmptyStateInstall = () => {
    setSidePanelContent(
      "Install snap",
      <InstallSnaps instanceId={instanceId} />,
    );
  };

  const installedSnaps = useMemo(
    () => getSnapsQueryResult?.data?.results ?? [],
    [getSnapsQueryResult],
  );

  return (
    <>
      {!snapsSearch && isLoading && currentPage === 1 && pageSize === 20 && (
        <LoadingState />
      )}
      {!isLoading &&
        !snapsSearch &&
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
      {(snapsSearch ||
        currentPage !== 1 ||
        pageSize !== 20 ||
        (getSnapsQueryResult &&
          getSnapsQueryResult?.data.results.length > 0)) && (
        <>
          <SnapsHeader
            instanceId={instanceId}
            selectedSnapIds={selectedSnapIds}
            onSnapsSearchChange={handleSnapsSearchChange}
            installedSnaps={installedSnaps}
          />
          <SnapsList
            instanceId={instanceId}
            selectedSnapIds={selectedSnapIds}
            setSelectedSnapIds={(items) => setSelectedSnapIds(items)}
            installedSnaps={installedSnaps}
            isSnapsLoading={isLoading}
          />
        </>
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={getSnapsQueryResult?.data?.count}
        paginate={(page) => {
          setCurrentPage(page);
        }}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        currentItemCount={getSnapsQueryResult?.data?.results.length}
      />
    </>
  );
};

export default SnapsPanel;
