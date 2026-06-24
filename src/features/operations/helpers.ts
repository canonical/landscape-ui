import type { OperationStatus } from "@/features/operations";
import { ICONS } from "@canonical/react-components";

export const getOperationStatusIcon = (status: OperationStatus | undefined) => {
  if (!status) {
    return null;
  }

  if (status === "succeeded") {
    return "success-grey";
  }

  if (status === "failed") {
    return ICONS.error;
  }

  return `${ICONS.spinner} u-animation--spin`;
};
