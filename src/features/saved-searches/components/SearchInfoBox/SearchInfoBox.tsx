import classNames from "classnames";
import { FC } from "react";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classes from "./SearchInfoBox.module.scss";

interface SearchInfoBoxProps {
  isExpanded: boolean;
  onHelpButtonClick: () => void;
  overflowingChipsAmount: number;
}

const SearchInfoBox: FC<SearchInfoBoxProps> = ({
  isExpanded,
  onHelpButtonClick,
  overflowingChipsAmount,
}) => {
  return (
    <div className={classes.infoContainer}>
      {overflowingChipsAmount > 0 && !isExpanded && (
        <span className={classNames("u-text--muted", classes.amount)}>
          {`+${overflowingChipsAmount}`}
        </span>
      )}

      <div className={classes.helpButtonContainer}>
        <Button
          type="button"
          appearance="base"
          hasIcon
          className={classes.helpButton}
          onClick={(event) => {
            event.stopPropagation();
            onHelpButtonClick();
          }}
        >
          <Icon name={ICONS.help} />
        </Button>
      </div>
    </div>
  );
};

export default SearchInfoBox;
