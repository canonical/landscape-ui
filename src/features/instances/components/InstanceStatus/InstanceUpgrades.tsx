import type { Instance } from "@/types/Instance";
import type { FC } from "react";
import { getUpgradeStatuses } from "./helpers";
import StatusPills from "./StatusPills";
import type { StatusItem } from "./types";

interface InstanceUpgradesProps {
  readonly instance: Instance;
  /** When provided, filterable upgrade pills become clickable table filters. */
  readonly onUpgradeClick?: (status: StatusItem) => void;
}

// Instances without package management (e.g. Windows) have no upgrade data. A
// muted neutral chip keeps the column visually consistent with its sibling
// pills instead of a bare "---".
const NOT_APPLICABLE: StatusItem = {
  key: "not-applicable",
  label: "N/A",
  icon: "",
  severity: "neutral",
};

const InstanceUpgrades: FC<InstanceUpgradesProps> = ({
  instance,
  onUpgradeClick,
}) => {
  const statuses = getUpgradeStatuses(instance);

  if (0 === statuses.length) {
    return <StatusPills statuses={[NOT_APPLICABLE]} />;
  }

  return <StatusPills statuses={statuses} onStatusClick={onUpgradeClick} />;
};

export default InstanceUpgrades;
