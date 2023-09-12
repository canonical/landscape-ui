import { FC } from "react";
import classNames from "classnames";
import { SearchBox } from "@canonical/react-components";
import classes from "./SearchBoxWithDescriptionButton.module.scss";

interface SearchBoxWithDescriptionButtonProps {
  inputValue: string;
  onInputChange: (inputValue: string) => void;
  onSearchClick: () => void;
  onDescriptionClick: () => void;
  onClear?: () => void;
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
        <button
          type="button"
          onClick={onDescriptionClick}
          className={classes.button}
        >
          <i className={classNames("p-icon--help", classes.icon)} />
        </button>
      </div>
    </div>
  );
};

export default SearchBoxWithDescriptionButton;
