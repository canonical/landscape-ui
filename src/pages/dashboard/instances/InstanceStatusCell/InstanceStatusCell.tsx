import { FC } from "react";
import { Instance } from "@/types/Instance";
import InstanceStatusLabel from "@/pages/dashboard/instances/InstanceStatusLabel";
import { STATUSES } from "@/pages/dashboard/instances/InstanceStatusLabel/constants";
import classes from "./InstanceStatusCell.module.scss";

interface InstanceStatusCellProps {
  instance: Instance;
}

const InstanceStatusCell: FC<InstanceStatusCellProps> = ({ instance }) => {
  if (instance.reboot_required_flag) {
    return (
      <InstanceStatusLabel
        icon={STATUSES.ComputerRebootAlert.icon}
        label="Reboot required"
      />
    );
  }

  const filteredAlerts = (instance?.alerts ?? []).filter(
    ({ type }) =>
      !["PackageUpgradesAlert", "SecurityUpgradesAlert"].includes(type),
  );

  if (0 === filteredAlerts.length) {
    return <InstanceStatusLabel icon={STATUSES.Online.icon} label="Online" />;
  }

  if (1 === filteredAlerts.length) {
    return (
      <InstanceStatusLabel
        icon={STATUSES[filteredAlerts[0].type].icon ?? STATUSES.Unknown.icon}
        label={filteredAlerts[0].summary}
      />
    );
  }

  return (
    <span>
      {filteredAlerts.map(({ type, summary }) => (
        <span className={classes.listItem} key={type}>
          <InstanceStatusLabel
            icon={STATUSES[type].icon ?? STATUSES.Unknown.icon}
            label={summary}
            onlyIcon
          />
        </span>
      ))}
    </span>
  );
};

export default InstanceStatusCell;
