import classNames from "classnames";
import type { FC } from "react";
import classes from "./Chip.module.scss";

interface ChipProps {
  readonly value: string;
  readonly className?: string;
}

const Chip: FC<ChipProps> = ({ className, value }) => {
  return (
    <span
      className={classNames(
        "p-chip is-dense u-no-margin--bottom u-no-margin--right",
        classes.chip,
        className,
      )}
    >
      <span className="p-chip__value">{value}</span>
    </span>
  );
};

export default Chip;
