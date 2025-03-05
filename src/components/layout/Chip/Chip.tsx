import classNames from "classnames";
import type { FC } from "react";
import classes from "./Chip.module.scss";

interface ChipProps {
  readonly text: string;
}

const Chip: FC<ChipProps> = ({ text }) => {
  return (
    <small className={classNames(classes.chip, "u-no-margin--bottom")}>
      {text}
    </small>
  );
};

export default Chip;
