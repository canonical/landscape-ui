import {
  Tooltip,
  TOOLTIP_DIRECTIONS,
  type TooltipProps,
} from "@/components/ui";
import type { FC, ReactNode } from "react";
import classes from "./FieldDescription.module.scss";
import { Icon, ICONS } from "@canonical/react-components";

interface FieldDescriptionProps {
  readonly description: ReactNode;
  readonly label: string;
  readonly preferredDirections?: TooltipProps["preferredDirections"];
}

const FieldDescription: FC<FieldDescriptionProps> = ({
  description,
  label,
  preferredDirections = TOOLTIP_DIRECTIONS.topStart,
}) => {
  return (
    <div className={classes.wrapper}>
      <span>{label}</span>
      <Tooltip
        preferredDirections={preferredDirections}
        message={<>{description}</>}
      >
        <Icon name={ICONS.help} />
      </Tooltip>
    </div>
  );
};

export default FieldDescription;
