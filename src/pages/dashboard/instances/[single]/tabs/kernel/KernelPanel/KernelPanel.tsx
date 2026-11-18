import LoadingState from "@/components/layout/LoadingState";
import { KernelDetails, KernelHeader, useKernel } from "@/features/kernel";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useParams } from "react-router";

interface KernelPanelProps {
  readonly instanceTitle: string;
}

const KernelPanel: FC<KernelPanelProps> = ({ instanceTitle }) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();

  const { getKernelQuery, getLivepatchInfoQuery } = useKernel();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const {
    data: kernelStatuses,
    isPending: isLoadingKernelStatuses,
    error: kernelError,
  } = getKernelQuery({ id: instanceId });

  const {
    data: getLivepatchInfoResult,
    isPending: isGettingLivepatchInfo,
    error: livePatchInfoError,
  } = getLivepatchInfoQuery({ id: instanceId });

  if (isLoadingKernelStatuses || isGettingLivepatchInfo)
    return <LoadingState />;

  if (!kernelStatuses) {
    throw (
      kernelError ?? new Error("The kernel information could not be loaded.")
    );
  }

  return (
    <KernelDetails
      kernelStatuses={kernelStatuses.data}
      livepatchInfo={getLivepatchInfoResult?.data}
      livepatchInfoError={livePatchInfoError}
      renderHeader={(hasTableData) => (
        <KernelHeader
          instanceName={instanceTitle}
          hasTableData={hasTableData}
          kernelStatuses={kernelStatuses.data}
        />
      )}
    />
  );
};

export default KernelPanel;
