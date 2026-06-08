import type { InstanceWithoutRelation } from "@/types/Instance";
import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { getInstanceStatuses } from "./helpers";
import StatusPills from "./StatusPills";
import type { StatusItem } from "./types";

interface InstanceStatusProps {
  readonly instance: InstanceWithoutRelation;
  /**
   * Renders a compact, expandable variant for table cells: red statuses stay
   * visible while the rest collapse behind a counter. When omitted, every
   * status is shown (used on the single instance view).
   */
  readonly expandable?: boolean;
  readonly isExpanded?: boolean;
  readonly onExpand?: (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  /** When provided, filterable status pills become clickable table filters. */
  readonly onStatusClick?: (status: StatusItem) => void;
}

const InstanceStatus: FC<InstanceStatusProps> = ({ instance, ...pillProps }) => (
  <StatusPills statuses={getInstanceStatuses(instance)} {...pillProps} />
);

export default InstanceStatus;
