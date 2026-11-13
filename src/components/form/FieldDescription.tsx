import {
  Tooltip,
  TOOLTIP_DIRECTIONS,
  type TooltipProps,
} from "@/components/ui";
import type { FC, ReactNode } from "react";
import classes from "./FieldDescription.module.scss";
import { Icon, ICONS } from "@canonical/react-components";

type TooltipPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "btm-left"
  | "btm-center"
  | "btm-right"
  | "left"
  | "right";

const PREFERRED_DIRECTIONS: Record<
  TooltipPosition,
  NonNullable<TooltipProps["preferredDirections"]>
> = {
  "top-left": TOOLTIP_DIRECTIONS.topStart,
  "top-center": TOOLTIP_DIRECTIONS.top,
  "top-right": TOOLTIP_DIRECTIONS.topEnd,
  "btm-left": TOOLTIP_DIRECTIONS.bottomStart,
  "btm-center": TOOLTIP_DIRECTIONS.bottom,
  "btm-right": TOOLTIP_DIRECTIONS.bottomEnd,
  left: TOOLTIP_DIRECTIONS.left,
  right: TOOLTIP_DIRECTIONS.right,
};

interface FieldDescriptionProps {
  readonly description: ReactNode;
  readonly label: string;
  readonly tooltipPosition?: TooltipPosition;
}

const FieldDescription: FC<FieldDescriptionProps> = ({
  description,
  label,
  tooltipPosition = "top-left",
}) => {
  return (
    <div className={classes.wrapper}>
      <span>{label}</span>
      <Tooltip
        preferredDirections={PREFERRED_DIRECTIONS[tooltipPosition]}
        message={<>{description}</>}
      >
        <Icon name={ICONS.help} />
      </Tooltip>
    </div>
  );
};

export default FieldDescription;
