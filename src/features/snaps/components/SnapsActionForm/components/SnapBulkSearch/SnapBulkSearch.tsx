import { pluralize } from "@/utils/_helpers";
import { SearchBox } from "@canonical/react-components";
import Downshift from "downshift";
import type { FC } from "react";
import { useRef, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import SnapBulkSearchList from "../SnapBulkSearchList";
import { DEBOUNCE_DELAY, MAX_SELECTED_SNAPS } from "./constants";
import type { InstalledSnapWithCount, SnapAction } from "../../../../types";
import { useGetBulkInstalledSnaps } from "../../../../api";

interface SnapBulkSearchProps {
  readonly instanceIds: number[];
  readonly selectedItems: InstalledSnapWithCount[];
  readonly setSelectedItems: (snaps: InstalledSnapWithCount[]) => void;
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

  const snapsQueryResult = useGetBulkInstalledSnaps(
    {
      computer_ids: instanceIds,
      search: search.trim() || undefined,
      status: searchScope,
    },
    // isDropdownOpen stops re-sending all cached requests on submission
    // staleTime stops refetching every time the dropdown is reopened
    // gcTime ensures it does refetch when a new form is opened
    { enabled: isDropdownOpen, gcTime: 0, staleTime: Infinity },
  );

  if (snapsQueryResult.isError) {
    throw snapsQueryResult.error;
  }

  const handleSearchBoxChange = (value: string) => {
    setInputValue(value);
    setSearch(value);
  };

  const clearSearchBox = () => {
    handleSearchBoxChange("");
  };

  const handleSelectItem = (item: InstalledSnapWithCount | null) => {
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
    } else if (!isDropdownOpen && event.key === "Enter") {
      openDropdown();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
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
            placeholder={`Search ${searchScope} snaps`}
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

          {isDropdownOpen && (
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
