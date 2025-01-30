import type { FC } from "react";
import classNames from "classnames";
import { Button, Icon, ICONS, SearchBox } from "@canonical/react-components";
import classes from "./SearchBoxWithDescriptionButton.module.scss";

interface SearchBoxWithDescriptionButtonProps {
  readonly inputValue: string;
  readonly onInputChange: (inputValue: string) => void;
  readonly onSearchClick: () => void;
  readonly onDescriptionClick: () => void;
  readonly onClear?: () => void;
}

const SearchBoxWithDescriptionButton: FC<
  SearchBoxWithDescriptionButtonProps
> = ({
  inputValue,
  onDescriptionClick,
  onInputChange,
  onSearchClick,
  onClear,
}) => {
  return (
    <div className={classes.wrapper}>
      <SearchBox
        autocomplete="off"
        shouldRefocusAfterReset
        externallyControlled
        value={inputValue}
        onChange={onInputChange}
        onSearch={onSearchClick}
        onClear={onClear}
        className={classNames("u-no-margin--bottom", classes.search)}
      />
      <div className={classes.buttonContainer}>
        <Button
          type="button"
          onClick={onDescriptionClick}
          className={classes.button}
        >
          <Icon name={ICONS.help} className={classes.icon} />
        </Button>
      </div>
    </div>
  );
};

export default SearchBoxWithDescriptionButton;
