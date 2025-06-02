import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./RegularInfoItem.module.scss";

export interface RegularInfoItemProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly className?: string;
}

const RegularInfoItem: FC<RegularInfoItemProps> = ({
  className,
  label,
  value,
}) => {
  return (
    <div className={classNames(classes.wrapper, className)}>
      <p className="p-text--small p-text--small-caps u-text--muted u-no-margin--bottom">
        {label}
      </p>

      {value}
    </div>
  );
};

export default RegularInfoItem;
