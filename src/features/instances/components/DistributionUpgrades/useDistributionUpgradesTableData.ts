import { useMemo } from "react";
import { useGetDistributionUpgradeTargets } from "@/features/instances";
import { formatDistributionTitle } from "./helpers";
import { INELIGIBLE_REASON_TITLES, ORDERED_REASONS } from "./constants";
import type { InstanceModalRow, TableRow } from "./types";

export const useDistributionUpgradesTableData = (
  selectedInstanceIds: number[],
) => {
  const { distributionUpgradeTargets, isGettingDistributionUpgradeTargets } =
    useGetDistributionUpgradeTargets(selectedInstanceIds, {
      enabled: selectedInstanceIds.length > 0,
    });

  const allRowsInfo = useMemo(() => {
    const targetsById = new Map(
      (distributionUpgradeTargets || []).map((t) => [t.computer_id, t]),
    );

    return selectedInstanceIds.map((instId) => {
      const target = targetsById.get(instId);

      const currentDistribution = target
        ? formatDistributionTitle(
            target.current_release_name,
            target.current_release_version,
            "Unknown",
          )
        : "Unknown";

      const targetDistribution =
        target && target.target_release_name
          ? formatDistributionTitle(
              target.target_release_name,
              target.target_release_version,
              "Unavailable",
            )
          : "Unavailable";

      const modalRow: InstanceModalRow = {
        instanceId: instId,
        instanceTitle: target?.computer_title ?? String(instId),
        currentDistribution,
        targetDistribution,
      };

      if (target) {
        return {
          modalRow,
          isEligible:
            !target.reason_code && Boolean(target.target_release_name),
          targetDistribution,
          reasonCode: target.reason_code ?? null,
        };
      } else {
        return {
          modalRow,
          isEligible: false,
          targetDistribution: "Unavailable",
          reasonCode: "no_upgrade_target",
        };
      }
    });
  }, [distributionUpgradeTargets, selectedInstanceIds]);

  const eligibleIds = useMemo(
    () =>
      allRowsInfo
        .filter((row) => row.isEligible)
        .map((row) => row.modalRow.instanceId),
    [allRowsInfo],
  );

  const tableData = useMemo(() => {
    const rows: TableRow[] = [];

    const eligibleInstances: InstanceModalRow[] = [];
    const eligibleMap = new Map<string, InstanceModalRow[]>();

    const ineligibleInstances: InstanceModalRow[] = [];
    const ineligibleMap = new Map<string, InstanceModalRow[]>();

    allRowsInfo.forEach((info) => {
      if (info.isEligible) {
        eligibleInstances.push(info.modalRow);
        const arr = eligibleMap.get(info.targetDistribution) || [];
        arr.push(info.modalRow);
        eligibleMap.set(info.targetDistribution, arr);
      } else {
        const { reasonCode } = info;
        const uiReasonTitle =
          INELIGIBLE_REASON_TITLES[reasonCode ?? ""] ?? "Unknown reason";

        const ineligibleRow: InstanceModalRow = {
          ...info.modalRow,
          reason: uiReasonTitle,
        };

        ineligibleInstances.push(ineligibleRow);

        const arr = ineligibleMap.get(uiReasonTitle) || [];
        arr.push(ineligibleRow);
        ineligibleMap.set(uiReasonTitle, arr);
      }
    });

    if (eligibleInstances.length > 0) {
      const canUpgradeSubRows: TableRow[] = [];
      Array.from(eligibleMap.entries()).forEach(([target, instances]) => {
        canUpgradeSubRows.push({
          text: `Upgrading to ${target}`,
          count: instances.length,
          instances,
        });
      });

      rows.push({
        text: "Can be upgraded",
        count: eligibleInstances.length,
        iconClass: "status-succeeded-small",
        instances: eligibleInstances,
        subRows: canUpgradeSubRows,
      });
    }

    if (ineligibleInstances.length > 0) {
      const cannotUpgradeSubRows: TableRow[] = [];
      const waitingIcon = "status-waiting-small";
      const groupedIneligibleInstances: InstanceModalRow[] = [];

      ORDERED_REASONS.forEach((reasonText) => {
        const instances = ineligibleMap.get(reasonText);
        if (instances && instances.length > 0) {
          cannotUpgradeSubRows.push({
            text: reasonText,
            count: instances.length,
            instances,
          });

          groupedIneligibleInstances.push(...instances);
        }
      });

      const remainingReasons = Array.from(ineligibleMap.keys())
        .filter((reasonText) => !ORDERED_REASONS.includes(reasonText))
        .sort((a, b) => a.localeCompare(b));

      remainingReasons.forEach((reasonText) => {
        const instances = ineligibleMap.get(reasonText);

        if (instances && instances.length > 0) {
          cannotUpgradeSubRows.push({
            text: reasonText,
            count: instances.length,
            instances,
          });

          groupedIneligibleInstances.push(...instances);
        }
      });

      rows.push({
        text: "Cannot be upgraded",
        count: groupedIneligibleInstances.length,
        iconClass: waitingIcon,
        instances: groupedIneligibleInstances,
        subRows: cannotUpgradeSubRows,
      });
    }

    return rows;
  }, [allRowsInfo]);

  return {
    isGettingDistributionUpgradeTargets,
    eligibleIds,
    tableData,
  };
};
