import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Button, Icon, ICONS, SearchBox } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import { boldSubstring, DEBOUNCE_DELAY } from "./helpers";
import classes from "./AutoInstallFileFormDropdown.module.scss";
import {
  useGetAutoinstallFiles,
  type AutoinstallFile,
} from "@/features/autoinstall-files";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

interface AutoInstallFileFormDropdownProps {
  readonly selectedItem: AutoinstallFile | null;
  readonly setSelectedItem: (items: AutoinstallFile | null) => void;
}

const AutoInstallFileFormDropdown: FC<AutoInstallFileFormDropdownProps> = ({
  selectedItem,
  setSelectedItem,
}) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const debug = useDebug();

  const { autoinstallFiles, autoinstallFilesCount, isFetching } =
    useGetAutoinstallFiles(
      {
        limit: 20,
        offset: 0,
        with_groups: false,
        search: search,
      },
      {
        enabled: !!search,
      },
    );

  const suggestions = autoinstallFiles.filter(
    (file) => selectedItem?.id !== file.id,
  );

  const handleDeleteSelectedItem = () => {
    setSelectedItem(null);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearch("");
  };

  const handleDropdownState = () => {
    if (inputValue.length > 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSearchBoxChange = (value: string) => {
    setInputValue(value);
    if (value.length > 2) {
      setSearch(value);
    }
  };

  const debouncedSearch = useDebounceCallback(() => {
    try {
      handleDropdownState();
    } catch (err) {
      debug(err);
    }
  }, DEBOUNCE_DELAY);

  const handleChooseSelectedItem = (item: AutoinstallFile) => {
    setSelectedItem(item);
    handleClearSearch();
  };

  const handleSelectItem = (item: AutoinstallFile | null) => {
    if (!item) {
      return;
    }
    handleChooseSelectedItem(item);
    setOpen(false);
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.currentTarget.blur();
    } else {
      debouncedSearch();
    }
  };

  const getHelpText = () => {
    if (!open && inputValue.length < 3) {
      return "Min 3. characters";
    }
    if (autoinstallFilesCount === 0 && search && !isFetching) {
      return `No autoinstall files found by "${search}"`;
    }
    return null;
  };

  const helpText = getHelpText();

  return (
    <div className={classes.container}>
      <Downshift
        onSelect={handleSelectItem}
        itemToString={() => ""}
        isOpen={open}
      >
        {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
          <div className="p-autocomplete">
            <SearchBox
              {...getInputProps()}
              placeholder="Search for available autoinstall files"
              className="u-no-margin--bottom"
              shouldRefocusAfterReset
              externallyControlled
              autocomplete="off"
              value={inputValue}
              onChange={handleSearchBoxChange}
              onClear={handleClearSearch}
              onBlur={closeDropdown}
              onFocus={handleDropdownState}
              onKeyUp={handleOnKeyUp}
            />
            {helpText ? (
              <span className="p-form-help-text">{helpText}</span>
            ) : null}
            {open && (suggestions.length > 0 || isFetching) ? (
              <ul
                className={classNames(
                  "p-list p-card--highlighted u-no-padding u-no-margin--bottom p-autocomplete__suggestions",
                  classes.suggestionsContainer,
                )}
                {...getMenuProps()}
              >
                {isFetching ? (
                  <LoadingState />
                ) : (
                  suggestions.map((item: AutoinstallFile, index: number) => (
                    <li
                      className={classNames("p-list__item", classes.pointer, {
                        [classes.highlighted]: highlightedIndex === index,
                      })}
                      key={item.filename}
                      {...getItemProps({
                        item,
                        index,
                      })}
                    >
                      <div className="u-truncate" data-testid="dropdownElement">
                        {boldSubstring(item.filename, search)}
                      </div>
                      <div>
                        <small className="u-text-muted">
                          Last edited:{" "}
                          {moment(item.last_modified_at).format(
                            DISPLAY_DATE_TIME_FORMAT,
                          )}
                        </small>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        )}
      </Downshift>

      <ul className="p-list p-autocomplete__result-list u-no-margin--bottom">
        {selectedItem ? (
          <li
            className={classNames(
              "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
              classes.selectedContainer,
            )}
            key={selectedItem.filename}
          >
            <div>
              <div>{selectedItem.filename}</div>
              <small className="u-text-muted p-text--small">
                Last edited:{" "}
                {moment(selectedItem.last_modified_at).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              </small>
            </div>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom"
              onClick={handleDeleteSelectedItem}
            >
              <Icon name={ICONS.delete} />
            </Button>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default AutoInstallFileFormDropdown;
