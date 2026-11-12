import { Tooltip, type TooltipProps } from "@/components/ui";
import type { FC } from "react";
import classes from "./TooltipCell.module.scss";
import classNames from "classnames";

const TooltipCell: FC<TooltipProps> = ({
  maxWidth = "20rem",
  messageElementClassName,
  targetElementClassName,
  ...props
}) => (
  <span className={classes.truncated}>
    <Tooltip
      maxWidth={maxWidth}
      targetElementClassName={classNames(
        classes.tooltipWrapper,
        targetElementClassName,
      )}
      messageElementClassName={classNames(
        classes.tooltipMessage,
        messageElementClassName,
      )}
      {...props}
    />
  </span>
);

export default TooltipCell;
