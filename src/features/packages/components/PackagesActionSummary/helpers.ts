import type { PackageAction, PackageChangePlanSummaryItem } from "../../types";
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

export const getActionSubmitButtonText = (action: PackageAction) => {
  switch (action) {
    case "install":
      return "Install";
    case "uninstall":
      return "Uninstall";
    case "hold":
      return "Hold";
    case "unhold":
      return "Unhold";
    case "changeVersion":
      return "Change version on";
  }
};

export const getActionSubmitButtonAppearance = (action: PackageAction) => {
  switch (action) {
    case "install":
    case "hold":
    case "unhold":
    case "changeVersion":
      return "positive";

    case "uninstall":
      return "negative";
  }
};
