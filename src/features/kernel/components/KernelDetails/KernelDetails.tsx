import EmptyState from "@/components/layout/EmptyState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import date from "@/libs/date";
import type { ApiError } from "@/types/api/ApiError";
import type { AxiosError } from "axios";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type {
  KernelManagementInfo,
  KernelOverviewInfo,
  LivepatchInformation,
} from "../../types";
import KernelOverview from "../KernelOverview";
import KernelTableList from "../KernelTableList";

interface KernelDetailsProps {
  readonly kernelStatuses: KernelManagementInfo;
  readonly livepatchInfo: LivepatchInformation | undefined;
  readonly livepatchInfoError: AxiosError<ApiError> | null;
  readonly renderHeader: (hasTableData: boolean) => ReactNode;
}

const KernelDetails: FC<KernelDetailsProps> = ({
  kernelStatuses,
  livepatchInfo,
  livepatchInfoError,
  renderHeader,
}) => {
  const { pageSize, currentPage } = usePageParams();

  const [kernelInfo] =
    livepatchInfo?.livepatch_info?.json?.output?.Status ?? [];

  const allLivepatchFixes = useMemo(
    () =>
      [...(kernelInfo?.Livepatch.Fixes ?? [])].sort((a, b) =>
        a.Name.localeCompare(b.Name, undefined, { numeric: true }),
      ),
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

  if (!kernelStatuses.installed)
    return (
      <EmptyState
        title="Kernel information unavailable"
        body={kernelStatuses.message || "No kernel information available"}
      />
    );

  const kernelOverviewData: KernelOverviewInfo = {
    currentVersion:
      kernelInfo?.Kernel || kernelStatuses.installed.version_rounded,
    expirationDate:
      kernelInfo?.UpgradeRequiredDate &&
      date(kernelInfo.UpgradeRequiredDate).isValid()
        ? kernelInfo.UpgradeRequiredDate
        : "",
    status: kernelStatuses.smart_status,
  };

  return (
    <>
      {renderHeader(livepatchFixes.length > 0)}
      <KernelOverview kernelOverview={kernelOverviewData} />
      {livepatchInfoError ? (
        <EmptyState
          title="Error loading kernel patches"
          body={
            livepatchInfoError.message ||
            "There was an issue loading pending kernel security patches."
          }
        />
      ) : (
        <>
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

export default KernelDetails;
