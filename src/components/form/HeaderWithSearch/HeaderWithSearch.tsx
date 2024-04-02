import { FC, isValidElement, ReactNode, useState } from "react";
import { Form, SearchBox, SearchBoxProps } from "@canonical/react-components";
import classes from "./HeaderWithSearch.module.scss";

interface HeaderWithSearchProps
  extends Omit<
    SearchBoxProps,
    | "onSearch"
    | "externallyControlled"
    | "shouldRefocusAfterReset"
    | "value"
    | "onClear"
    | "onChange"
    | "ref"
  > {
  onSearch: (searchText: string) => void;
  actions?: ReactNode;
}

const HeaderWithSearch: FC<HeaderWithSearchProps> = ({
  actions,
  autocomplete,
  onSearch,
  ...inputProps
}) => {
  const [inputText, setInputText] = useState("");

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <Form
          className="u-no-margin--bottom"
          onSubmit={(event) => {
            event.preventDefault();

            onSearch(inputText.trim());
          }}
        >
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            autocomplete={autocomplete ?? "off"}
            onSearch={() => onSearch(inputText.trim())}
            value={inputText}
            onChange={(inputValue) => setInputText(inputValue)}
            onClear={() => {
              setInputText("");
              onSearch("");
            }}
            {...inputProps}
          />
        </Form>
      </div>

      {isValidElement(actions) && (
        <div className={classes.noShrink}>{actions}</div>
      )}
    </div>
  );
};

export default HeaderWithSearch;
