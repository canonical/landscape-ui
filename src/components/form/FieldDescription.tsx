import { FC, ReactNode } from "react";
import classes from "./FieldDescription.module.scss";
import { Icon, ICONS, Tooltip } from "@canonical/react-components";

type TooltipProps = React.ComponentProps<typeof Tooltip>;
type TooltipPosition = TooltipProps["position"];

interface FieldDescriptionProps {
  description: ReactNode;
  label: string;
  tooltipPosition?: TooltipPosition;
}

const FieldDescription: FC<FieldDescriptionProps> = ({
  description,
  label,
  tooltipPosition = "top-left",
}) => {
  return (
    <div className={classes.wrapper}>
      <span>{label}</span>
      <Tooltip position={tooltipPosition} message={description}>
        <Icon name={ICONS.help} />
      </Tooltip>
    </div>
  );
};

export default FieldDescription;
