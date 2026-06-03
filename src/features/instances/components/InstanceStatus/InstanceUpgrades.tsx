import NoData from "@/components/layout/NoData";
import type { Instance } from "@/types/Instance";
import type { FC } from "react";
import { getUpgradeStatuses } from "./helpers";
import StatusPills from "./StatusPills";

interface InstanceUpgradesProps {
  readonly instance: Instance;
}

const InstanceUpgrades: FC<InstanceUpgradesProps> = ({ instance }) => {
  const statuses = getUpgradeStatuses(instance);

  if (0 === statuses.length) {
    return <NoData />;
  }

  return <StatusPills statuses={statuses} />;
};

export default InstanceUpgrades;
