import { pluralize } from "@/utils/_helpers";
import { SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import { useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import SnapBulkSearchList from "../SnapBulkSearchList";
import { DEBOUNCE_DELAY, MAX_SELECTED_SNAPS } from "./constants";
import classes from "./SnapBulkSearch.module.scss";
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
  const { value: isOpen, setFalse: close, setTrue: open } = useBoolean();

  const snapsQueryResult = useGetBulkInstalledSnaps({
    computer_ids: instanceIds,
    search: search.trim() || undefined,
  });

  const { error: snapsError } = snapsQueryResult;

  if (snapsError) {
    throw snapsError;
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
    close();
  };

  const isOverLimit = selectedItems.length >= MAX_SELECTED_SNAPS;
  const searchScope = action === "install" ? "available" : "installed";
  const preposition = action === "change channel" ? " on" : "";

  return (
    <Downshift
      onSelect={handleSelectItem}
      itemToString={(item) => (item ? item.snap.name : "")}
      isOpen={isOpen}
      onOuterClick={close}
    >
      {(downshiftOptions) => (
        <div>
          <SearchBox
            {...downshiftOptions.getInputProps()}
            placeholder={`Search ${searchScope} snaps`}
            className="u-no-margin--bottom"
            shouldRefocusAfterReset
            externallyControlled
            autocomplete="off"
            value={inputValue}
            onChange={handleSearchBoxChange}
            onClear={clearSearchBox}
            onClick={open}
            disabled={isOverLimit}
          />
          {isOverLimit && (
            <span className="p-form-help-text">
              You can only {action}
              {preposition} a maximum of{" "}
              {pluralize(MAX_SELECTED_SNAPS, ["snap"], "exact")} at once.
            </span>
          )}

          {isOpen && (
            <div
              className={classNames(
                "p-card--highlighted",
                "u-no-margin",
                "u-no-padding",
                classes.suggestionsContainer,
              )}
              {...downshiftOptions.getMenuProps()}
            >
              <SnapBulkSearchList
                downshiftOptions={downshiftOptions}
                queryResult={snapsQueryResult}
                search={search}
                selectedSnaps={selectedItems}
              />
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
};

export default SnapBulkSearch;
