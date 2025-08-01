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
    <div className={className}>
      <div
        className={classNames("p-text--x-small u-text--muted", classes.label)}
      >
        {label}
      </div>

      <div>{value}</div>
    </div>
  );
};

export default RegularInfoItem;
