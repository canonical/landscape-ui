import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import type { KernelOverviewInfo } from "@/features/kernel";
import { KernelOverview, KernelTableList, useKernel } from "@/features/kernel";
import usePageParams from "@/hooks/usePageParams";
import date from "@/libs/date";
import { useMemo } from "react";
import type { Instance } from "@/types/Instance";

interface SupportInstanceKernelProps {
  readonly instance: Instance;
}
/** The Kernel tab of an instance in a support session. */
const SupportInstanceKernel: FC<SupportInstanceKernelProps> = ({
  instance,
}) => {
  const { pageSize, currentPage } = usePageParams();
  const { getKernelQuery, getLivepatchInfoQuery } = useKernel();

  const { data: kernelStatuses, isPending: isLoadingKernelStatuses } =
    getKernelQuery({ id: instance.id });

  const { data: getLivepatchInfoResult } = getLivepatchInfoQuery({
    id: instance.id,
  });

  const [kernelInfo] =
    getLivepatchInfoResult?.data.livepatch_info?.json?.output?.Status ?? [];

  const allLivepatchFixes = useMemo(
    () => kernelInfo?.Livepatch.Fixes ?? [],
    [kernelInfo],
  );

  const livepatchFixes = useMemo(
    () => allLivepatchFixes.slice((currentPage - 1) * pageSize, pageSize),
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
      date(kernelInfo.UpgradeRequiredDate).isValid()
        ? kernelInfo.UpgradeRequiredDate
        : "",
    status: kernelStatuses.data.smart_status,
  };

  return (
    <>
      <h2 className="p-heading--4 u-no-padding--top">Kernel overview</h2>
      <KernelOverview kernelOverview={kernelOverviewData} />
      <KernelTableList kernelData={livepatchFixes} />
      <TablePagination
        totalItems={allLivepatchFixes.length}
        currentItemCount={livepatchFixes.length}
      />
    </>
  );
};

export default SupportInstanceKernel;
