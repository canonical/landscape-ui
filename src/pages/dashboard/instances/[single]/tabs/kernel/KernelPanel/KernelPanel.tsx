import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  KernelOverview,
  KernelOverviewInfo,
  KernelTableHeader,
  KernelTableList,
  useKernel,
} from "@/features/kernel";
import { usePageParams } from "@/hooks/usePageParams";
import { UrlParams } from "@/types/UrlParams";
import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";

interface KernelPanelProps {
  instanceTitle: string;
}

const KernelPanel: FC<KernelPanelProps> = ({ instanceTitle }) => {
  const { instanceId } = useParams<UrlParams>();
  const { pageSize, currentPage } = usePageParams();
  const { getKernelQuery, getLivepatchInfoQuery } = useKernel();

  const { data: kernelStatuses, isPending: isLoadingKernelStatuses } =
    getKernelQuery({
      id: parseInt(instanceId ?? ""),
    });

  const { data: getLivepatchInfoResult } = getLivepatchInfoQuery({
    id: parseInt(instanceId ?? ""),
  });

  const allLivepatchFixes =
    getLivepatchInfoResult?.data.livepatch_info?.json.output.Status[0].Livepatch
      .Fixes ?? [];

  const getLivepatchFixes = (limit: number, offset: number) => {
    return allLivepatchFixes.slice(offset, offset + limit);
  };

  const livepatchFixes = useMemo(
    () => getLivepatchFixes(pageSize, (currentPage - 1) * pageSize),
    [allLivepatchFixes, currentPage, pageSize],
  );

  const kernelOverviewData: KernelOverviewInfo = {
    currentVersion:
      getLivepatchInfoResult?.data.livepatch_info?.json.output.Status[0]
        .Kernel ??
      kernelStatuses?.data.installed?.version_rounded ??
      "",
    expirationDate:
      getLivepatchInfoResult?.data.livepatch_info?.json.output.Status[0]
        .UpgradeRequiredDate ?? "",
    status: kernelStatuses?.data.smart_status ?? "",
  };

  return (
    <>
      {isLoadingKernelStatuses && <LoadingState />}
      {!isLoadingKernelStatuses && !kernelStatuses?.data.installed && (
        <EmptyState
          title="Kernel Information Unavailable"
          body={
            kernelStatuses?.data.message || "No kernel information available"
          }
        />
      )}
      {!isLoadingKernelStatuses && kernelStatuses?.data.installed && (
        <>
          <KernelOverview kernelOverview={kernelOverviewData} />
          <KernelTableHeader
            instanceName={instanceTitle}
            hasTableData={livepatchFixes.length > 0}
            kernelStatuses={kernelStatuses.data}
          />
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
