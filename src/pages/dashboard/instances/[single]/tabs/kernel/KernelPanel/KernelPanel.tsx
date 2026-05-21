import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { TablePagination } from "@/components/layout/TablePagination";
import type { KernelOverviewInfo } from "@/features/kernel";
import {
  KernelHeader,
  KernelOverview,
  KernelTableList,
  useKernel,
} from "@/features/kernel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { UrlParams } from "@/types/UrlParams";
import moment from "moment";
import type { FC } from "react";
import { lazy, useMemo } from "react";
import { useParams } from "react-router";

const DowngradeKernelForm = lazy(
  async () => import("@/features/kernel/components/DowngradeKernelForm"),
);
const UpgradeKernelForm = lazy(
  async () => import("@/features/kernel/components/UpgradeKernelForm"),
);
const RestartInstanceForm = lazy(
  async () => import("@/features/kernel/components/RestartInstanceForm"),
);

interface KernelPanelProps {
  readonly instanceTitle: string;
}

const KernelPanel: FC<KernelPanelProps> = ({ instanceTitle }) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();

  const { pageSize, currentPage, lastSidePathSegment, popSidePathUntilClear } =
    usePageParams();
  const { getKernelQuery, getLivepatchInfoQuery } = useKernel();

  useSetDynamicFilterValidation("sidePath", [
    "downgrade",
    "upgrade",
    "restart",
  ]);

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { data: kernelStatuses, isPending: isLoadingKernelStatuses } =
    getKernelQuery({ id: instanceId });

  const { data: getLivepatchInfoResult } = getLivepatchInfoQuery({
    id: instanceId,
  });

  const kernelInfo =
    getLivepatchInfoResult?.data.livepatch_info?.json?.output?.Status &&
    getLivepatchInfoResult?.data.livepatch_info?.json?.output?.Status.length > 0
      ? getLivepatchInfoResult?.data.livepatch_info?.json?.output?.Status[0]
      : undefined;

  const allLivepatchFixes = kernelInfo?.Livepatch.Fixes ?? [];

  const getLivepatchFixes = (limit: number, offset: number) => {
    return allLivepatchFixes.slice(offset, offset + limit);
  };

  const livepatchFixes = useMemo(
    () => getLivepatchFixes(pageSize, (currentPage - 1) * pageSize),
    [allLivepatchFixes, currentPage, pageSize],
  );

  const kernelOverviewData: KernelOverviewInfo = {
    currentVersion:
      kernelInfo?.Kernel ??
      kernelStatuses?.data.installed?.version_rounded ??
      "",
    expirationDate:
      kernelInfo?.UpgradeRequiredDate &&
      moment(kernelInfo?.UpgradeRequiredDate).isValid()
        ? kernelInfo.UpgradeRequiredDate
        : "",
    status: kernelStatuses?.data.smart_status ?? "",
  };

  const currentKernelVersion =
    kernelStatuses?.data.installed?.version_rounded ?? "";
  const downgradeKernelVersions = kernelStatuses?.data.downgrades ?? [];
  const upgradeKernelVersions = kernelStatuses?.data.upgrades ?? [];

  return (
    <>
      {isLoadingKernelStatuses && <LoadingState />}
      {!isLoadingKernelStatuses && !kernelStatuses?.data.installed && (
        <EmptyState
          title="Kernel information unavailable"
          body={
            kernelStatuses?.data.message || "No kernel information available"
          }
        />
      )}
      {!isLoadingKernelStatuses && kernelStatuses?.data.installed && (
        <>
          <KernelHeader
            instanceName={instanceTitle}
            hasTableData={livepatchFixes.length > 0}
            kernelStatuses={kernelStatuses.data}
          />
          <KernelOverview kernelOverview={kernelOverviewData} />
          <KernelTableList kernelData={livepatchFixes} />
          <TablePagination
            totalItems={allLivepatchFixes.length}
            currentItemCount={livepatchFixes.length}
          />
        </>
      )}

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "downgrade" ||
          lastSidePathSegment === "upgrade" ||
          lastSidePathSegment === "restart"
        }
      >
        {lastSidePathSegment === "downgrade" && (
          <SidePanel.Suspense key="downgrade">
            <SidePanel.Header>Downgrade kernel</SidePanel.Header>
            <SidePanel.Content>
              <DowngradeKernelForm
                instanceName={instanceTitle}
                currentKernelVersion={currentKernelVersion}
                downgradeKernelVersions={downgradeKernelVersions}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "upgrade" && (
          <SidePanel.Suspense key="upgrade">
            <SidePanel.Header>Upgrade kernel</SidePanel.Header>
            <SidePanel.Content>
              <UpgradeKernelForm
                instanceName={instanceTitle}
                currentKernelVersion={currentKernelVersion}
                upgradeKernelVersions={upgradeKernelVersions}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "restart" && (
          <SidePanel.Suspense key="restart">
            <SidePanel.Header>Restart {instanceTitle}</SidePanel.Header>
            <SidePanel.Content>
              <RestartInstanceForm
                instanceName={instanceTitle}
                showNotification={livepatchFixes.length > 0}
                newKernelVersionId={upgradeKernelVersions[0]?.id}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default KernelPanel;
