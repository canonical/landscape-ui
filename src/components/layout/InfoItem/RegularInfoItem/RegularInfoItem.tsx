import classNames from "classnames";
import type { FC, HTMLAttributes, ReactNode } from "react";
import NoData from "../../NoData";
import classes from "./RegularInfoItem.module.scss";

export interface RegularInfoItemProps extends HTMLAttributes<HTMLDivElement> {
  readonly label: string;
  readonly value: ReactNode;
}

const RegularInfoItem: FC<RegularInfoItemProps> = ({
  label,
  value,
  ...props
}) => {
  return (
    <div {...props}>
      <div
        className={classNames("p-text--x-small u-text--muted", classes.label)}
      >
        {label}
      </div>

      <div>{value ?? <NoData />}</div>
    </div>
  );
};

export default RegularInfoItem;
