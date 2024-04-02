import LoadingState from "@/components/layout/LoadingState";
import { Package } from "@/types/Package";
import { AvailableSnap, AvailableSnapInfo, SelectedSnaps } from "@/types/Snap";
import { Button, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import React, { useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import useDebug from "@/hooks/useDebug";
import classes from "./DropdownSearch.module.scss";
import { UseQueryResult } from "@tanstack/react-query";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { DEBOUNCE_DELAY, boldSubstring, getItemKey } from "./helpers";
import AvailableSnapDetails from "@/features/snaps/AvailableSnapDetails";

type Item = Package | AvailableSnap | SelectedSnaps;

type Props<T extends Item> = {
  itemType: string;
  selectedItems: T[];
  setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>;
  getDropdownInfo: (
    search: string,
  ) => UseQueryResult<
    AxiosResponse<ApiPaginatedResponse<T>, any>,
    AxiosError<ApiError, any>
  >;
  getItemInfo?: (
    name: string,
  ) => UseQueryResult<
    AxiosResponse<AvailableSnapInfo, any>,
    AxiosError<ApiError, any>
  >;
  addConfirmation?: boolean;
  setConfirming?: React.Dispatch<React.SetStateAction<boolean>>;
  instanceId?: number;
};

const DropdownSearch = <T extends Item>({
  itemType,
  getDropdownInfo,
  selectedItems,
  setSelectedItems,
  addConfirmation = false,
  setConfirming,
  instanceId,
}: Props<T>) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [toBeConfirmedItem, setToBeConfirmedItem] = useState<T | null>();
  const [inputValue, setInputValue] = useState<string>("");
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const debug = useDebug();

  const { data: dropdownInfo, isFetching } = getDropdownInfo(search);

  const suggestionData: T[] = dropdownInfo?.data?.results ?? [];

  const handleDeleteSelectedItem = (name: string) => {
    setSelectedItems((items) => items.filter((item) => item.name !== name));
  };

  const handleDeleteToBeConfirmedItem = () => {
    setToBeConfirmedItem(null);
    if (setConfirming) {
      setConfirming(false);
    }
  };

  const getAvailableSuggestions = (item: T): boolean => {
    return !selectedItems.map((item) => item.name).includes(item.name);
  };

  const suggestions = suggestionData.filter(getAvailableSuggestions);

  useEffect(() => {
    if (!toBeConfirmedItem) {
      searchBoxRef.current?.focus();
    }
  }, [toBeConfirmedItem]);

  const closeDropdown = () => {
    if (toBeConfirmedItem) {
      return;
    }
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

  const handleAddToSelectedItems = (item: Item) => {
    if ("computers" in item) {
      setSelectedItems([
        ...selectedItems,
        {
          name: item.name,
          current_version: item.current_version,
        } as T,
      ]);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          name: item.name,
          snap: item.snap,
          "snap-id": item["snap-id"],
          channel: "channel" in item ? item.channel : undefined,
          revision: "revision" in item ? item.revision : undefined,
        } as T,
      ]);
    }
    handleClearSearch();
    if (addConfirmation) {
      handleDeleteToBeConfirmedItem();
    }
  };

  const handleSelectSuggestedItem = (item: T | null) => {
    if (addConfirmation && setConfirming && item) {
      setConfirming(true);
      setToBeConfirmedItem(item);
    } else if (item) {
      handleAddToSelectedItems(item);
      setOpen(false);
    }
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
    if (suggestionData.length === 0 && search && !isFetching) {
      return `No ${itemType}s found by "${search}"`;
    }
    return null;
  };

  const helpText = getHelpText();

  return (
    <div className={classes.container}>
      <Downshift
        onSelect={handleSelectSuggestedItem}
        itemToString={() => ""}
        isOpen={open}
      >
        {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
          <div className="p-autocomplete">
            <SearchBox
              {...getInputProps()}
              placeholder={`Search for available ${itemType}s`}
              className="u-no-margin--bottom"
              shouldRefocusAfterReset
              externallyControlled
              autocomplete="off"
              value={inputValue}
              ref={searchBoxRef}
              disabled={!!toBeConfirmedItem}
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
                {toBeConfirmedItem && instanceId ? (
                  <AvailableSnapDetails
                    handleAddToSelectedItems={handleAddToSelectedItems}
                    handleDeleteToBeConfirmedItem={
                      handleDeleteToBeConfirmedItem
                    }
                    name={toBeConfirmedItem.name}
                    instanceId={instanceId}
                    key={getItemKey(toBeConfirmedItem)}
                  />
                ) : isFetching ? (
                  <LoadingState />
                ) : (
                  suggestions.map((item: T, index: number) => (
                    <li
                      className={classNames("p-list__item", classes.pointer, {
                        [classes.highlighted]: highlightedIndex === index,
                      })}
                      key={getItemKey(item)}
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
                          {"current_version" in item
                            ? item.current_version
                            : item.snap.publisher["display-name"]}
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

      <ul className="p-list p-autocomplete__result-list">
        {selectedItems.length
          ? selectedItems.map((item) => (
              <li
                className={classNames(
                  "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
                  classes.selectedContainer,
                )}
                key={getItemKey(item)}
              >
                <div>
                  <div className={classes.bold}>{item.name}</div>
                  <span>
                    <small className="u-text--muted p-text--small">
                      {"current_version" in item
                        ? item.current_version
                        : `${item.snap.publisher["display-name"]} | ${"channel" in item ? item.channel : ""}`}
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

export default DropdownSearch;
