import { Tooltip, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
interface ReportHelpTooltipProps {
  readonly message: string;
  readonly position?: "top-center" | "btm-left";
  readonly followMouse?: boolean;
}

const ReportHelpTooltip: FC<ReportHelpTooltipProps> = ({
  message,
  position = "top-center",
  followMouse,
}) => (
  <Tooltip message={message} position={position} followMouse={followMouse}>
    <Icon name={ICONS.help} aria-hidden />
    <span className="u-off-screen">Help</span>
  </Tooltip>
);

export default ReportHelpTooltip;
