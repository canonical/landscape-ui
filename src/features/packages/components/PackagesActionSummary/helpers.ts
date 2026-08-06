import type { PackageChangePlanSummaryItem } from "../../types";
import { TargetState } from "../../types";

export const getApplicableCount = (
  packageChangePlanSummaryItem: PackageChangePlanSummaryItem,
): number => {
  const applicableStateCount =
    packageChangePlanSummaryItem.package_state_counts.find(
      (packageStateCount) => packageStateCount.state === TargetState.APPLICABLE,
    );

  return applicableStateCount ? applicableStateCount.count : 0;
};
