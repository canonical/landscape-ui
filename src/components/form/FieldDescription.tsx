import { FC, ReactNode } from "react";
import classes from "./FieldDescription.module.scss";
import classNames from "classnames";

interface FieldDescriptionProps {
  description: ReactNode;
  label: string;
}

const FieldDescription: FC<FieldDescriptionProps> = ({
  description,
  label,
}) => {
  return (
    <div className={classes.wrapper}>
      <span>{label}</span>
      <div className="p-tooltip--top-left">
        <i className="p-icon--help" />
        <div
          className={classNames("p-tooltip__message", classes.tooltip)}
          role="tooltip"
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export default FieldDescription;
