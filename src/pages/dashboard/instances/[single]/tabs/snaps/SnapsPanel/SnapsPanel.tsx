import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  EditSnapType,
  SnapsHeader,
  SnapsList,
  getSelectedSnaps,
  useSnaps,
} from "@/features/snaps";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { UrlParams } from "@/types/UrlParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, useMemo, useState } from "react";
import { useParams } from "react-router";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { pluralizeWithCount } from "@/utils/_helpers";

const InstallSnapsForm = lazy(
  async () => import("@/features/snaps/components/InstallSnaps"),
);

const EditSnapForm = lazy(
  async () => import("@/features/snaps/components/EditSnap"),
);

const SnapDetailsView = lazy(
  async () => import("@/features/snaps/components/SnapDetails"),
);

const SnapsPanel: FC = () => {
  const [selectedSnapIds, setSelectedSnapIds] = useState<string[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const {
    search,
    currentPage,
    pageSize,
    lastSidePathSegment,
    name,
    popSidePathUntilClear,
    createSidePathPusher,
  } = usePageParams();
  const { getSnapsQuery } = useSnaps();

  useSetDynamicFilterValidation("sidePath", [
    "install",
    "view",
    "switch",
    "uninstall",
    "hold",
    "unhold",
    "refresh",
  ]);

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { data: getSnapsQueryResult, isLoading } = getSnapsQuery({
    instance_id: instanceId,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  const handleEmptyStateInstall = createSidePathPusher("install");

  const installedSnaps = useMemo(
    () => getSnapsQueryResult?.data?.results ?? [],
    [getSnapsQueryResult],
  );

  const handleClearSelection = () => {
    setSelectedSnapIds([]);
  };

  const selectedSnapsToEdit = useMemo(
    () => getSelectedSnaps(installedSnaps, selectedSnapIds),
    [installedSnaps, selectedSnapIds],
  );

  const viewSnap = useMemo(
    () => installedSnaps.find((s) => s.snap.name === name),
    [installedSnaps, name],
  );

  const isBulkAction =
    lastSidePathSegment &&
    ["switch", "uninstall", "hold", "unhold", "refresh"].includes(
      lastSidePathSegment,
    );

  const bulkActionType = lastSidePathSegment
    ? (lastSidePathSegment.charAt(0).toUpperCase() +
        lastSidePathSegment.slice(1)) as EditSnapType
    : null;

  const snapsToEdit =
    selectedSnapsToEdit.length > 0
      ? selectedSnapsToEdit
      : viewSnap
        ? [viewSnap]
        : [];

  return (
    <>
      {!search &&
        isLoading &&
        currentPage === 1 &&
        pageSize === DEFAULT_PAGE_SIZE && <LoadingState />}
      {!isLoading &&
        !search &&
        (!getSnapsQueryResult ||
          getSnapsQueryResult.data.results.length === 0) && (
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
            setSelectedSnapIds={(items) => {
              setSelectedSnapIds(items);
            }}
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

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={Boolean(
          lastSidePathSegment === "install" ||
            (lastSidePathSegment === "view" && !!viewSnap) ||
            (isBulkAction && snapsToEdit.length > 0),
        )}
        size="small"
      >
        {lastSidePathSegment === "install" && (
          <SidePanel.Suspense key="install">
            <SidePanel.Header>Install snaps</SidePanel.Header>
            <SidePanel.Content>
              <InstallSnapsForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && viewSnap && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>{viewSnap.snap.name} details</SidePanel.Header>
            <SidePanel.Content>
              <SnapDetailsView installedSnap={viewSnap} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {isBulkAction && bulkActionType && snapsToEdit.length > 0 && (
          <SidePanel.Suspense key={lastSidePathSegment}>
            <SidePanel.Header>
              {snapsToEdit.length === 1
                ? `${bulkActionType} ${snapsToEdit[0]?.snap.name}${
                    bulkActionType === EditSnapType.Switch ? "'s channel" : ""
                  }`
                : `${bulkActionType} ${pluralizeWithCount(
                    snapsToEdit.length,
                    "snap",
                  )}`}
            </SidePanel.Header>
            <SidePanel.Content>
              <EditSnapForm
                type={bulkActionType}
                installedSnaps={snapsToEdit}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default SnapsPanel;
