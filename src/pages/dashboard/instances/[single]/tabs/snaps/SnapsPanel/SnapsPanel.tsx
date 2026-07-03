import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  InstallSnaps,
  SnapsHeader,
  SnapsList,
  useGetInstalledSnaps,
} from "@/features/snaps";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import useSidePanel from "@/hooks/useSidePanel";
import type { InstalledSnap } from "@/features/snaps";
import type { UrlParams } from "@/types/UrlParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useParams } from "react-router";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

const SnapsPanel: FC = () => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { search, currentPage, pageSize } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const {
    installedSnaps,
    installedSnapsCount,
    isInstalledSnapsLoading: isLoading,
  } = useGetInstalledSnaps({
    instance_id: instanceId,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  const { selectedItems: selectedSnaps, setSelectedItems: setSelectedSnaps } =
    useSelection<InstalledSnap>(installedSnaps, isLoading);

  const handleClearSelection = () => {
    setSelectedSnaps([]);
  };

  const handleEmptyStateInstall = () => {
    setSidePanelContent("Install snaps", <InstallSnaps />);
  };

  return (
    <>
      {!search &&
        isLoading &&
        currentPage === 1 &&
        pageSize === DEFAULT_PAGE_SIZE && <LoadingState />}
      {!isLoading && !search && installedSnaps.length === 0 && (
        <EmptyState
          title="You haven't installed any snaps yet"
          cta={[
            <Button
              type="button"
              appearance="positive"
              key="empty-state-install-snap"
              onClick={handleEmptyStateInstall}
            >
              Install snaps
            </Button>,
          ]}
        />
      )}
      {(search ||
        currentPage !== 1 ||
        pageSize !== DEFAULT_PAGE_SIZE ||
        installedSnaps.length > 0) && (
        <>
          <SnapsHeader
            selectedSnaps={selectedSnaps}
            handleClearSelection={handleClearSelection}
          />
          <SnapsList
            selectedSnaps={selectedSnaps}
            setSelectedSnaps={setSelectedSnaps}
            installedSnaps={installedSnaps}
            isSnapsLoading={isLoading}
          />
        </>
      )}
      <TablePagination
        handleClearSelection={handleClearSelection}
        totalItems={installedSnapsCount}
        currentItemCount={installedSnaps.length}
      />
    </>
  );
};

export default SnapsPanel;
