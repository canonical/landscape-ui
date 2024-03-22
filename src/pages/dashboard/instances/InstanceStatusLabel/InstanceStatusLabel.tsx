import { FC, ReactNode } from "react";
import classes from "./InstanceStatusLabel.module.scss";
import { Tooltip } from "@canonical/react-components";

interface InstanceStatusLabelProps {
  icon: ReactNode;
  label: string;
  onlyIcon?: boolean;
}

const InstanceStatusLabel: FC<InstanceStatusLabelProps> = ({
  icon,
  label,
  onlyIcon = false,
}) => {
  return onlyIcon ? (
    <Tooltip message={label}>
      <span>{icon}</span>
    </Tooltip>
  ) : (
    <span className={classes.root}>
      <span className={classes.icon}>{icon}</span>
      <span>{label}</span>
    </span>
  );
};

export default InstanceStatusLabel;
