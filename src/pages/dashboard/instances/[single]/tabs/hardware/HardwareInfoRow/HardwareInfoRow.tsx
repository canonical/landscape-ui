import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./HardwareInfoRow.module.scss";

interface HardwareInfoRowProps {
  readonly children: ReactNode;
  readonly label: string;
}

const HardwareInfoRow: FC<HardwareInfoRowProps> = ({ children, label }) => {
  return (
    <div className={classNames("p-strip u-no-max-width", classes.wrapper)}>
      <h3 className={classNames("p-heading--4", classes.blockTitle)}>
        {label}
      </h3>
      <div className={classes.infoRows}>{children}</div>
    </div>
  );
};

export default HardwareInfoRow;
