import { FC } from "react";
import { Instance } from "@/types/Instance";
import InstanceStatusLabel from "@/pages/dashboard/instances/InstanceStatusLabel";
import { STATUSES } from "@/pages/dashboard/instances/InstanceStatusLabel/constants";

interface InstanceUpgradesCellProps {
  instance: Instance;
}

const InstanceUpgradesCell: FC<InstanceUpgradesCellProps> = ({ instance }) => {
  if (
    !instance.upgrades ||
    (!instance.upgrades.security && !instance.upgrades.regular)
  ) {
    return (
      <InstanceStatusLabel icon={STATUSES.UpToDate.icon} label="Up to date" />
    );
  }

  if (!instance.upgrades.security) {
    return (
      <InstanceStatusLabel
        icon={STATUSES.PackageUpgradesAlert.icon}
        label={`${instance.upgrades.regular} regular ${instance.upgrades.regular > 1 ? "upgrades" : "upgrade"}`}
      />
    );
  }

  if (!instance.upgrades.regular) {
    return (
      <InstanceStatusLabel
        icon={STATUSES.SecurityUpgradesAlert.icon}
        label={`${instance.upgrades.security} security ${instance.upgrades.security > 1 ? "upgrades" : "upgrade"}`}
      />
    );
  }

  const label = `${instance.upgrades.security} security ${instance.upgrades.security > 1 ? "upgrades" : "upgrade"}, ${instance.upgrades.regular} regular ${instance.upgrades.regular > 1 ? "upgrades" : "upgrade"}`;

  return (
    <InstanceStatusLabel
      icon={STATUSES.SecurityUpgradesAlert.icon}
      label={label}
    />
  );
};

export default InstanceUpgradesCell;
