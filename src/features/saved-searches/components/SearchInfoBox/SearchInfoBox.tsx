import { Button } from "@canonical/react-ds-global";
import type { FC } from "react";
import classes from "./SearchInfoBox.module.scss";

interface SearchInfoBoxProps {
  readonly onHelpButtonClick: () => void;
}

const SearchInfoBox: FC<SearchInfoBoxProps> = ({ onHelpButtonClick }) => {
  return (
    <div className={classes.infoContainer}>
      <div className={classes.helpButtonContainer}>
        <Button
          type="button"
          importance="tertiary"
          icon="help"
          aria-label="Search help"
          className={classes.helpButton}
          onClick={(event) => {
            event.stopPropagation();
            onHelpButtonClick();
          }}
        />
      </div>
    </div>
  );
};

export default SearchInfoBox;
