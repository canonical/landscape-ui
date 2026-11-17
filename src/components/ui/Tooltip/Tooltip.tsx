import { TooltipEngine } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC } from "react";
import classes from "./Tooltip.module.scss";
import type { TooltipProps } from "./types";

const Tooltip: FC<TooltipProps> = ({
  children,
  message,
  messageElementClassName,
  ...popupOptions
}) => (
  <TooltipEngine
    Message={message}
    messageElementClassName={classNames(
      classes.message,
      messageElementClassName,
    )}
    {...popupOptions}
  >
    {children}
  </TooltipEngine>
);

export default Tooltip;
