import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import type { KernelOverviewInfo } from "@/features/kernel";
import {
  KernelHeader,
  KernelOverview,
  KernelTableList,
  useKernel,
} from "@/features/kernel";
import usePageParams from "@/hooks/usePageParams";
import type { UrlParams } from "@/types/UrlParams";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import { useParams } from "react-router";

interface KernelPanelProps {
  readonly instanceTitle: string;
}

const KernelPanel: FC<KernelPanelProps> = ({ instanceTitle }) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();

  const { pageSize, currentPage } = usePageParams();
  const { getKernelQuery, getLivepatchInfoQuery } = useKernel();

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
    </>
  );
};

export default KernelPanel;
