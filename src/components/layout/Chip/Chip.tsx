import classNames from "classnames";
import type { FC } from "react";
import classes from "./Chip.module.scss";

interface ChipProps {
  readonly value: string;
  readonly className?: string;
  readonly title?: string;
}

const Chip: FC<ChipProps> = ({ className, value, title }) => {
  return (
    <span
      className={classNames(
        "p-chip is-dense u-no-margin--bottom",
        classes.chip,
        className,
      )}
      title={title}
    >
      <span className="p-chip__value">{value}</span>
    </span>
  );
};

export default Chip;
