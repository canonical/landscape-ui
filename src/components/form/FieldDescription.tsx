import { FC, ReactNode } from "react";
import classes from "./FieldDescription.module.scss";
import classNames from "classnames";

interface FieldDescriptionProps {
  description: ReactNode;
  label: string;
  tooltipPosition?:
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "left"
    | "right"
    | "top-left"
    | "top-center"
    | "top-right";
}

const FieldDescription: FC<FieldDescriptionProps> = ({
  description,
  label,
  tooltipPosition = "top-left",
}) => {
  const tooltipPositionClassName = classNames({
    "p-tooltip": tooltipPosition === "bottom-left",
    "p-tooltip--btm-center": tooltipPosition === "bottom-center",
    "p-tooltip--btm-right": tooltipPosition === "bottom-right",
    "p-tooltip--left": tooltipPosition === "left",
    "p-tooltip--right": tooltipPosition === "right",
    "p-tooltip--top-left": tooltipPosition === "top-left",
    "p-tooltip--top-center": tooltipPosition === "top-center",
    "p-tooltip--top-right": tooltipPosition === "top-right",
  });

  return (
    <div className={classes.wrapper}>
      <span>{label}</span>
      <div className={tooltipPositionClassName}>
        <i className="p-icon--help" />
        <div
          className={classNames("p-tooltip__message", classes.tooltip)}
          role="tooltip"
        >
          {description}
          <div className={classes.angle} />
        </div>
      </div>
    </div>
  );
};

export default FieldDescription;
