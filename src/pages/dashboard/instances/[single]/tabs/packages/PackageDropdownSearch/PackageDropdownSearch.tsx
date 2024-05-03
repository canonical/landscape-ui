import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import { usePackages } from "@/hooks/usePackages";
import { Package } from "@/types/Package";
import { Button, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import React, { FC, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import classes from "./PackageDropdownSearch.module.scss";
import { DEBOUNCE_DELAY, boldSubstring } from "./helpers";

interface PackageDropdownSearchProps {
  instanceId: number;
  selectedItems: Package[];
  setSelectedItems: (items: Package[]) => void;
}

const PackageDropdownSearch: FC<PackageDropdownSearchProps> = ({
  instanceId,
  selectedItems,
  setSelectedItems,
}) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const debug = useDebug();
  const { getInstancePackagesQuery } = usePackages();

  const { data: packageDataRes, isFetching } = getInstancePackagesQuery(
    {
      instance_id: instanceId,
      available: true,
      installed: false,
      upgrade: false,
      held: false,
      limit: 50,
      search: search,
    },
    {
      enabled: search.length > 2,
    },
  );

  const packageData = packageDataRes?.data?.results ?? [];

  const getAvailablePackageSuggestions = (item: Package): boolean => {
    return !selectedItems.map((item) => item.name).includes(item.name);
  };

  const suggestions = packageData.filter(getAvailablePackageSuggestions);

  const handleDeleteSelectedItem = (name: string) => {
    setSelectedItems(selectedItems.filter((item) => item.name !== name));
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

  const handleAddToSelectedItems = (item: Package) => {
    setSelectedItems([...selectedItems, item]);
    handleClearSearch();
  };

  const handleSelectItem = (item: Package | null) => {
    if (!item) {
      return;
    }
    handleAddToSelectedItems(item);
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
    if (packageData.length === 0 && search && !isFetching) {
      return `No packages found by "${search}"`;
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
              placeholder="Search for available packages"
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
                  suggestions.map((item: Package, index: number) => (
                    <li
                      className={classNames("p-list__item", classes.pointer, {
                        [classes.highlighted]: highlightedIndex === index,
                      })}
                      key={item.name}
                      {...getItemProps({
                        item,
                        index,
                      })}
                    >
                      <div className="u-truncate" data-testid="dropdownElement">
                        {boldSubstring(item.name, search)}
                      </div>
                      <div>
                        <small className="u-text-muted">
                          {item.current_version}
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
        {selectedItems.length
          ? selectedItems.map((item) => (
              <li
                className={classNames(
                  "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
                  classes.selectedContainer,
                )}
                key={item.name}
              >
                <div>
                  <div>{item.name}</div>
                  <span>
                    <small className="u-text--muted p-text--small">
                      {item.current_version}
                    </small>
                  </span>
                </div>
                <Button
                  appearance="link"
                  className="u-no-margin--bottom u-no-padding--top"
                  onClick={() => handleDeleteSelectedItem(item.name)}
                >
                  <i className="p-icon--delete" />
                </Button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default PackageDropdownSearch;
