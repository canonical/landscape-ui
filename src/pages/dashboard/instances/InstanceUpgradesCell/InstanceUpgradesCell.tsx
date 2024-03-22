import { FC } from "react";
import { Instance } from "@/types/Instance";
import InstanceStatusLabel from "@/pages/dashboard/instances/InstanceStatusLabel";
import { STATUSES } from "@/pages/dashboard/instances/InstanceStatusLabel/constants";

interface InstanceUpgradesCellProps {
  instance: Instance;
}

const InstanceUpgradesCell: FC<InstanceUpgradesCellProps> = ({ instance }) => {
  const securityUpgradesAlert = (instance?.alerts ?? []).find(
    ({ type }) => "SecurityUpgradesAlert" === type,
  );

  if (securityUpgradesAlert) {
    return (
      <InstanceStatusLabel
        icon={STATUSES.SecurityUpgradesAlert.icon}
        label={securityUpgradesAlert.summary}
      />
    );
  }

  const regularUpgradesAlert = (instance?.alerts ?? []).find(
    ({ type }) => "PackageUpgradesAlert" === type,
  );

  if (regularUpgradesAlert) {
    return (
      <InstanceStatusLabel
        icon={STATUSES.PackageUpgradesAlert.icon}
        label={regularUpgradesAlert.summary}
      />
    );
  }

  return (
    <InstanceStatusLabel icon={STATUSES.UpToDate.icon} label="Up to date" />
  );
};

export default InstanceUpgradesCell;
