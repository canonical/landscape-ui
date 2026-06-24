import { Tooltip } from "@canonical/react-components";
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
    <i className="p-icon--help" role="img" aria-label={message} />
  </Tooltip>
);

export default ReportHelpTooltip;
