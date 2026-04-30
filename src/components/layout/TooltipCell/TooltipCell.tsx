import { Tooltip } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import classes from "./TooltipCell.module.scss";

interface TooltipCellProps {
  readonly message: string;
  readonly children: ReactNode;
}

const TooltipCell: FC<TooltipCellProps> = ({ message, children }) => (
  <span className={classes.truncated}>
    <Tooltip
      message={message}
      positionElementClassName={classes.tooltipWrapper}
    >
      {children}
    </Tooltip>
  </span>
);

export default TooltipCell;
