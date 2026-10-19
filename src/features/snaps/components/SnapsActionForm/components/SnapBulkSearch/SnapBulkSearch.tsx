import { pluralize } from "@/utils/_helpers";
import { SearchBox } from "@canonical/react-components";
import Downshift from "downshift";
import type { FC } from "react";
import { useRef, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import SnapBulkSearchList from "../SnapBulkSearchList";
import { DEBOUNCE_DELAY, MAX_SELECTED_SNAPS } from "./constants";
import type { SnapWithCount, SnapAction } from "../../../../types";
import { useGetBulkSnaps } from "../../../../api";

interface SnapBulkSearchProps {
  readonly instanceIds: number[];
  readonly selectedItems: SnapWithCount[];
  readonly setSelectedItems: (snaps: SnapWithCount[]) => void;
  readonly action: SnapAction;
}

const SnapBulkSearch: FC<SnapBulkSearchProps> = ({
  instanceIds,
  selectedItems,
  setSelectedItems,
  action,
}) => {
  const [search, setSearch] = useDebounceValue("", DEBOUNCE_DELAY);
  const [inputValue, setInputValue] = useState<string>("");
  const {
    value: isDropdownOpen,
    setFalse: closeDropdown,
    setTrue: openDropdown,
  } = useBoolean();

  const scrollFromKeyboard = useRef(false);

  const getSearchScope = () => {
    switch (action) {
      case "install":
        return "available";
      case "unhold":
        return "held";
      default:
        return "installed";
    }
  };
  const searchScope = getSearchScope();

  const isQueryEnabled = isDropdownOpen && (action !== "install" || !!search);

  const snapsQueryResult = useGetBulkSnaps(
    {
      computer_ids: instanceIds,
      search: search || undefined,
      status: searchScope,
    },
    // isDropdownOpen stops re-sending all cached requests on submission
    // staleTime stops refetching every time the dropdown is reopened
    // gcTime ensures it does refetch when a new form is opened
    { enabled: isQueryEnabled, gcTime: 0, staleTime: Infinity },
  );

  if (snapsQueryResult.isError) {
    throw snapsQueryResult.error;
  }

  const handleSearchBoxChange = (value: string) => {
    setInputValue(value);
    setSearch(value.trim());
    if (!isDropdownOpen) {
      openDropdown();
    }
  };

  const clearSearchBox = () => {
    handleSearchBoxChange("");
  };

  const handleSelectItem = (item: SnapWithCount | null) => {
    if (!item) {
      return;
    }

    setSelectedItems([...selectedItems, item]);
    clearSearchBox();
    closeDropdown();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      closeDropdown();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (!isDropdownOpen) {
        openDropdown();
      }
      scrollFromKeyboard.current = true;
    }
  };

  const isOverLimit = selectedItems.length >= MAX_SELECTED_SNAPS;
  const preposition = action === "change channel" ? "s on" : "";

  return (
    <Downshift
      onSelect={handleSelectItem}
      itemToString={(item) => item?.snap.name ?? ""}
      isOpen={isDropdownOpen}
      onOuterClick={closeDropdown}
      scrollIntoView={(node) => {
        // Needed to avoid auto-scrolling up when the next page loads
        if (scrollFromKeyboard.current) {
          node?.scrollIntoView({ block: "nearest" });
          scrollFromKeyboard.current = false;
        }
      }}
    >
      {(downshiftOptions) => (
        <div>
          <SearchBox
            {...downshiftOptions.getInputProps({ onKeyDown })}
            placeholder={
              action === "install"
                ? `Start typing to search ${searchScope} snaps`
                : `Search ${searchScope} snaps`
            }
            className="u-no-margin--bottom"
            shouldRefocusAfterReset
            externallyControlled
            autocomplete="off"
            value={inputValue}
            onChange={handleSearchBoxChange}
            onClear={clearSearchBox}
            onClick={openDropdown}
            onFocus={openDropdown}
            onBlur={closeDropdown}
            disabled={isOverLimit}
          />
          {isOverLimit && (
            <div className="is-caution">
              <span className="p-form-validation__message">
                You can only {action}
                {preposition} a maximum of{" "}
                {pluralize(MAX_SELECTED_SNAPS, ["snap"], "exact")} at once.
              </span>
            </div>
          )}

          {isQueryEnabled && (
            <SnapBulkSearchList
              downshiftOptions={downshiftOptions}
              queryResult={snapsQueryResult}
              search={search}
              selectedSnaps={selectedItems}
            />
          )}
        </div>
      )}
    </Downshift>
  );
};

export default SnapBulkSearch;
