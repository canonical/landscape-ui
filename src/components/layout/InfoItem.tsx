import { FC } from "react";
import classes from "./InfoItem.module.scss";
import classNames from "classnames";

export interface InfoItemProps {
  label: string;
  value: string;
  className?: string;
}

const InfoItem: FC<InfoItemProps> = ({ label, value, className }) => {
  return (
    <div className={classNames(classes.wrapper, className)}>
      <p className="p-text--small p-text--small-caps u-text--muted u-no-margin--bottom">
        {label}
      </p>
      <span>{value}</span>
    </div>
  );
};

export default InfoItem;
