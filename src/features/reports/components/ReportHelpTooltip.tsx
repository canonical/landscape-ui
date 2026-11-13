import { Tooltip, TOOLTIP_DIRECTIONS } from "@/components/ui";
import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";

interface ReportHelpTooltipProps {
  readonly message: string;
  readonly position?: "top-center" | "btm-left";
}

const ReportHelpTooltip: FC<ReportHelpTooltipProps> = ({
  message,
  position = "top-center",
}) => (
  <Tooltip
    message={message}
    preferredDirections={
      position === "btm-left" ? TOOLTIP_DIRECTIONS.bottomStart : undefined
    }
  >
    <Icon name={ICONS.help} aria-hidden />
    <span className="u-off-screen">Help</span>
  </Tooltip>
);

export default ReportHelpTooltip;
