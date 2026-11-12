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
import date from "@/libs/date";
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

  const [kernelInfo] =
    getLivepatchInfoResult?.data.livepatch_info?.json?.output?.Status ?? [];

  const allLivepatchFixes = useMemo(
    () => kernelInfo?.Livepatch.Fixes ?? [],
    [kernelInfo],
  );

  const livepatchFixes = useMemo(
    () =>
      allLivepatchFixes.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [allLivepatchFixes, currentPage, pageSize],
  );

  if (isLoadingKernelStatuses) return <LoadingState />;

  if (!kernelStatuses?.data.installed)
    return (
      <EmptyState
        title="Kernel information unavailable"
        body={kernelStatuses?.data.message || "No kernel information available"}
      />
    );

  const kernelOverviewData: KernelOverviewInfo = {
    currentVersion:
      kernelInfo?.Kernel ?? kernelStatuses.data.installed.version_rounded,
    expirationDate:
      kernelInfo?.UpgradeRequiredDate &&
      date(kernelInfo?.UpgradeRequiredDate).isValid()
        ? kernelInfo.UpgradeRequiredDate
        : "",
    status: kernelStatuses.data.smart_status,
  };

  return (
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
  );
};

export default KernelPanel;
