import { Tooltip, type TooltipProps } from "@/components/ui";
import type { FC, ReactNode } from "react";
import classes from "./TooltipCell.module.scss";
import classNames from "classnames";

type TooltipCellProps = Omit<TooltipProps, "message"> & {
  readonly message?: ReactNode;
};

const TooltipCell: FC<TooltipCellProps> = ({
  children,
  message,
  messageElementClassName,
  targetElementClassName,
  ...props
}) => (
  <span className={classes.truncated}>
    {message ? (
      <Tooltip
        message={message}
        targetElementClassName={classNames(
          classes.tooltipWrapper,
          targetElementClassName,
        )}
        messageElementClassName={classNames(
          classes.tooltipMessage,
          messageElementClassName,
        )}
        {...props}
      >
        {children}
      </Tooltip>
    ) : (
      children
    )}
  </span>
);

export default TooltipCell;
