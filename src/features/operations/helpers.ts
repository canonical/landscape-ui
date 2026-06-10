import type { Operation } from "@/features/operations";
import { ICONS } from "@canonical/react-components";

export const getOperationStatusIcon = (operation: Operation | undefined) => {
  const { status } = operation?.metadata ?? {};

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
