import { Tooltip, type TooltipProps } from "@/components/ui";
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
  "top-left": ["block-start", "block-end", "inline-start", "inline-end"],
  "top-center": ["block-start", "block-end", "inline-start", "inline-end"],
  "top-right": ["block-start", "block-end", "inline-start", "inline-end"],
  "btm-left": ["block-end", "block-start", "inline-end", "inline-start"],
  "btm-center": ["block-end", "block-start", "inline-end", "inline-start"],
  "btm-right": ["block-end", "block-start", "inline-end", "inline-start"],
  left: ["inline-start", "inline-end", "block-start", "block-end"],
  right: ["inline-end", "inline-start", "block-start", "block-end"],
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
