import type { TooltipProps } from "@canonical/react-components";
import { Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./TooltipCell.module.scss";
import classNames from "classnames";

const TooltipCell: FC<TooltipProps> = ({
  positionElementClassName,
  tooltipClassName,
  ...props
}) => (
  <span className={classes.truncated}>
    <Tooltip
      positionElementClassName={classNames(
        classes.tooltipWrapper,
        positionElementClassName,
      )}
      tooltipClassName={classNames(classes.tooltipMessage, tooltipClassName)}
      {...props}
    />
  </span>
);

export default TooltipCell;
