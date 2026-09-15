import { pluralize } from "@/utils/_helpers";
import { SearchBox, Switch } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import { useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import SnapBulkSearchList from "../SnapBulkSearchList";
import {
  DEBOUNCE_DELAY,
  MAX_SELECTED_SNAPS,
  QUERY_LIMIT,
} from "./constants";
import classes from "./SnapBulkSearch.module.scss";
import type { SelectedSnaps, SnapAction } from "../../../../types";

interface SnapBulkSearchProps {
  readonly instanceIds: number[];
  readonly selectedItems: SelectedSnaps[];
  readonly setSelectedItems: (snaps: SelectedSnaps[]) => void;
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
  const { value: exact, toggle: toggleExact } = useBoolean();

  const { value: isOpen, setFalse: close, setTrue: open } = useBoolean();

  const queryParams: SearchSnapsRequest = {
    computer_query: instanceIds.map((id) => `id:${id}`).join(" OR "),
    limit: QUERY_LIMIT,
    ...mapActionToQueryParams(action),
  };

  if (exact) {
    queryParams.names = [search];
  } else {
    queryParams.text = search.trim() || undefined;
  }

  const snapsQueryResult = useSearchSnaps(queryParams, {
    enabled: !(exact && !search),
  });

  const {
    data: snapsResponse,
    isPending: isPendingSnaps,
    error: snapsError,
  } = snapsQueryResult;

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

  const handleSelectItem = (item: Snap | null) => {
    if (!item) {
      return;
    }

    setSelectedItems([...selectedItems, [item, []]]);
    clearSearchBox();
    close();
  };

  const isOverLimit = selectedItems.length >= MAX_SELECTED_SNAPS;

  const getWarningVerb = () => {
    switch (action) {
      case "install":
        return "install";
      case "remove":
        return "remove";
      case "hold":
        return "hold";
      case "unhold":
        return "unhold";
      default:
        return "change channels on";
    }
  };

  return (
      <Downshift
        onSelect={handleSelectItem}
        itemToString={(item) => (item ? item.name : "")}
        isOpen={isOpen}
        onOuterClick={close}
      >
        {(downshiftOptions) => (
          <div className="p-autocomplete">
            <SearchBox
              {...downshiftOptions.getInputProps()}
              placeholder={`Search ${mapActionToSearch(action)} snaps`}
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
                You can only {getWarningVerb()} a maximum of{" "}
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
                <div className={classes.topRow}>
                  <Switch
                    label="Exact match"
                    onChange={toggleExact}
                    checked={exact}
                  />

                  <span>{downshiftOptions.selectedItem?.publisher}</span>
                </div>

                <SnapBulkSearchList
                  downshiftOptions={downshiftOptions}
                  exact={exact}
                  queryResult={snapsQueryResult}
                  search={search}
                  selectedSnaps={selectedItems.map(([item]) => item)}
                />
              </div>
            )}
          </div>
        )}
      </Downshift>
  );
};

export default SnapBulkSearch;
