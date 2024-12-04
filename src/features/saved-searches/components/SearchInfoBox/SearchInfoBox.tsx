import { Button, Icon, ICONS } from "@canonical/react-components";
import { FC } from "react";
import classes from "./SearchInfoBox.module.scss";

interface SearchInfoBoxProps {
  onHelpButtonClick: () => void;
}

const SearchInfoBox: FC<SearchInfoBoxProps> = ({ onHelpButtonClick }) => {
  return (
    <div className={classes.infoContainer}>
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
