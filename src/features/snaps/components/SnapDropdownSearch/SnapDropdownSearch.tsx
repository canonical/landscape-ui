import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import type { UrlParams } from "@/types/UrlParams";
import { Button, Icon, ICONS, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useDebounceCallback } from "usehooks-ts";
import { useSnaps } from "../../hooks";
import type { AvailableSnap, SelectedSnaps } from "../../types";
import AvailableSnapDetails from "../AvailableSnapDetails";
import classes from "./SnapDropdownSearch.module.scss";
import { boldSubstring, DEBOUNCE_DELAY } from "./helpers";

interface SnapDropdownSearchProps {
  readonly selectedItems: SelectedSnaps[];
  readonly setSelectedItems: (items: SelectedSnaps[]) => void;
  readonly setConfirming: (confirming: boolean) => void;
}

const SnapDropdownSearch: FC<SnapDropdownSearchProps> = ({
  selectedItems,
  setSelectedItems,
  setConfirming,
}) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { getAvailableSnaps } = useSnaps();

  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [toBeConfirmedItem, setToBeConfirmedItem] =
    useState<AvailableSnap | null>();
  const [inputValue, setInputValue] = useState<string>("");
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const instanceId = Number(urlInstanceId);

  const { data: snapsDataRes, isFetching } = getAvailableSnaps(
    {
      instance_id: instanceId,
      query: search,
    },
    {
      enabled: search.length > 2,
    },
  );

  const snapsData = snapsDataRes?.data?.results ?? [];

  const getAvailableSnapSuggestions = (itemName: string): boolean => {
    return !selectedItems.map((item) => item.name).includes(itemName);
  };

  const suggestions = snapsData.filter((snap) =>
    getAvailableSnapSuggestions(snap.name),
  );

  useEffect(() => {
    if (!toBeConfirmedItem) {
      searchBoxRef.current?.focus();
    }
  }, [toBeConfirmedItem]);

  const handleDeleteSelectedItem = (name: string) => {
    setSelectedItems(selectedItems.filter((item) => item.name !== name));
  };

  const handleDeleteToBeConfirmedItem = () => {
    setToBeConfirmedItem(null);
    if (setConfirming) {
      setConfirming(false);
    }
  };

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

  const handleAddToSelectedItems = (item: SelectedSnaps) => {
    setSelectedItems([...selectedItems, item]);
    handleClearSearch();
    handleDeleteToBeConfirmedItem();
  };

  const handleSelectSuggestedItem = (item: AvailableSnap | null) => {
    if (item) {
      setConfirming(true);
      setToBeConfirmedItem(item);
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
    if (snapsData.length === 0 && search && !isFetching) {
      return `No snaps found by "${search}"`;
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
              placeholder="Search for available snaps"
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
                    key={toBeConfirmedItem["snap-id"]}
                  />
                ) : isFetching ? (
                  <LoadingState />
                ) : (
                  suggestions.map((item: AvailableSnap, index: number) => (
                    <li
                      className={classNames("p-list__item", classes.pointer, {
                        [classes.highlighted]: highlightedIndex === index,
                      })}
                      key={item["snap-id"]}
                      {...getItemProps({
                        item,
                        index,
                      })}
                    >
                      <div className="u-truncate" data-testid="dropdownElement">
                        {boldSubstring(item.name, search)}
                      </div>
                      <small className="u-text-muted">
                        {item.snap.publisher["display-name"]}
                      </small>
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
                key={item["snap-id"]}
              >
                <div>
                  <div>{item.name}</div>
                  <span>
                    <small className="u-text--muted p-text--small">
                      {`${item.snap.publisher["display-name"]} | ${item.channel}`}
                    </small>
                  </span>
                </div>
                <Button
                  type="button"
                  appearance="link"
                  className="u-no-margin--bottom"
                  onClick={() => {
                    handleDeleteSelectedItem(item.name);
                  }}
                >
                  <Icon name={ICONS.delete} />
                </Button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default SnapDropdownSearch;
