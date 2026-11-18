import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { KernelDetails } from "@/features/kernel";
import { useGetStaffKernel, useGetStaffLivepatchInfo } from "../../api";
import type { SupportInstanceTabProps } from "../../types";

/** The Kernel tab of an instance in a support session. */
const SupportInstanceKernel: FC<SupportInstanceTabProps> = ({
  name,
  instance,
}) => {
  const {
    staffKernel: kernelStatuses,
    isGettingStaffKernel,
    staffKernelError,
  } = useGetStaffKernel(name, instance.id);

  const {
    staffLivepatchInfo,
    isGettingStaffLivepatchInfo,
    staffLivepatchInfoError,
  } = useGetStaffLivepatchInfo(name, instance.id);

  if (isGettingStaffKernel || isGettingStaffLivepatchInfo)
    return <LoadingState />;

  if (!kernelStatuses) {
    throw (
      staffKernelError ??
      new Error("The kernel information could not be loaded.")
    );
  }

  return (
    <KernelDetails
      kernelStatuses={kernelStatuses}
      livepatchInfo={staffLivepatchInfo}
      livepatchInfoError={staffLivepatchInfoError}
      renderHeader={() => (
        <h2 className="p-heading--4 u-no-padding--top">Kernel overview</h2>
      )}
    />
  );
};

export default SupportInstanceKernel;
