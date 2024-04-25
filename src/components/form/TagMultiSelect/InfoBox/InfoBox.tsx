import classNames from "classnames";
import { FC } from "react";
import classes from "./InfoBox.module.scss";

interface InfoBoxProps {
  isExpanded: boolean;
  overflowingChipsAmount: number;
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
