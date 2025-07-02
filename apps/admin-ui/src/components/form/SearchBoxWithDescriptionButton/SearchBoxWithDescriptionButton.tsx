import {
  Button,
  Form,
  Icon,
  ICONS,
  SearchBox,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC, SyntheticEvent } from "react";
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
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSearchClick();
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.formContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            className="u-no-margin--bottom"
            autocomplete="off"
            value={inputValue}
            onChange={onInputChange}
            onClear={onClear}
            onSearch={onSearchClick}
          />
        </Form>
      </div>

      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames("u-no-margin--bottom", classes.helpButton)}
        onClick={onDescriptionClick}
        aria-label="Help"
      >
        <Icon name={ICONS.help} />
      </Button>
    </div>
  );
};

export default SearchBoxWithDescriptionButton;
