import { Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ReadOnlyField.module.scss";
import NoData from "@/components/layout/NoData";

interface ReadOnlyFieldProps {
  readonly label?: string;
  readonly value?: string;
  readonly tooltipMessage?: string;
  readonly required?: boolean;
}

const ReadOnlyField: FC<ReadOnlyFieldProps> = ({
  label,
  value,
  tooltipMessage,
  required,
}) => (
  <div className={classes.field}>
    <label>
      {required ? "* " : ""} {label}
    </label>
    <Tooltip
      position="btm-left"
      className={classes.container}
      message={tooltipMessage}
      followMouse
    >
      <div className={classes.locked}>
        <span>{value || <NoData />}</span>
        <Icon name="lock-locked" />
      </div>
    </Tooltip>
  </div>
);

export default ReadOnlyField;
