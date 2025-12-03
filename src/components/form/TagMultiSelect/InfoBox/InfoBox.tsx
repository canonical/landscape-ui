import classNames from "classnames";
import type { FC } from "react";
import classes from "./InfoBox.module.scss";

interface InfoBoxProps {
  readonly isExpanded: boolean;
  readonly overflowingChipsAmount: number;
}

const InfoBox: FC<InfoBoxProps> = ({ isExpanded, overflowingChipsAmount }) => {
  return (
    overflowingChipsAmount > 0 &&
    !isExpanded && (
      <div className={classes.infoContainer}>
        <span className={classNames("u-text--muted", classes.amount)}>
          {`+${overflowingChipsAmount}`}
        </span>
      </div>
    )
  );
};

export default InfoBox;
