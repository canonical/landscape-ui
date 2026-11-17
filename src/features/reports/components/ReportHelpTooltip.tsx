import { Tooltip } from "@/components/ui";
import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";

interface ReportHelpTooltipProps {
  readonly message: string;
}

const ReportHelpTooltip: FC<ReportHelpTooltipProps> = ({ message }) => (
  <Tooltip message={message}>
    <Icon name={ICONS.help} aria-hidden />
    <span className="u-off-screen">Help</span>
  </Tooltip>
);

export default ReportHelpTooltip;
