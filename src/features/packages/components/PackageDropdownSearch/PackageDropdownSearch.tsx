import { pluralize } from "@/utils/_helpers";
import { SearchBox, Switch } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import { useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import type { Package, PackageAction, PackageWithVersions } from "../../types";
import PackageDropdownSearchCount from "./components/PackageDropdownSearchCount";
import PackageDropdownSearchItem from "./components/PackageDropdownSearchItem";
import PackageDropdownSearchList from "./components/PackageDropdownSearchList";
import {
  DEBOUNCE_DELAY,
  MAX_SELECTED_PACKAGES,
  QUERY_LIMIT,
} from "./constants";
import classes from "./PackageDropdownSearch.module.scss";
import { mapActionToQueryParams, mapActionToSearch } from "../../helpers";
import PackageSearchDowngradeItem from "./components/PackageSearchDowngradeItem";
import type { SearchPackagesRequest } from "../../api/useSearchPackages";
import useSearchPackages from "../../api/useSearchPackages";

interface PackageDropdownSearchProps {
  readonly instanceIds: number[];
  readonly selectedItems: PackageWithVersions[];
  readonly setSelectedItems: (packages: PackageWithVersions[]) => void;
  readonly action: PackageAction;
}

const PackageDropdownSearch: FC<PackageDropdownSearchProps> = ({
  instanceIds,
  selectedItems,
  setSelectedItems,
  action,
}) => {
  const [search, setSearch] = useDebounceValue("", DEBOUNCE_DELAY);
  const [inputValue, setInputValue] = useState<string>("");
  const { value: exact, toggle: toggleExact } = useBoolean();

  const { value: isOpen, setFalse: close, setTrue: open } = useBoolean();

  const queryParams: SearchPackagesRequest = {
    computer_query: instanceIds.map((id) => `id:${id}`).join(" OR "),
    limit: QUERY_LIMIT,
    ...mapActionToQueryParams(action),
  };

  if (exact) {
    queryParams.names = [search];
  } else {
    queryParams.text = search;
  }

  const packagesQueryResult = useSearchPackages(queryParams, {
    enabled: !(exact && !search),
  });

  const {
    data: packagesResponse,
    isPending: isPendingPackages,
    error: packagesError,
  } = packagesQueryResult;

  if (packagesError) {
    throw packagesError;
  }

  const handleSearchBoxChange = (value: string) => {
    setInputValue(value);
    setSearch(value);
  };

  const clearSearchBox = () => {
    handleSearchBoxChange("");
  };

  const handleSelectItem = (item: Package | null) => {
    if (!item) {
      return;
    }

    setSelectedItems([...selectedItems, [item, []]]);
    clearSearchBox();
    close();
  };

  const isOverLimit = selectedItems.length >= MAX_SELECTED_PACKAGES;

  const getWarningVerb = () => {
    switch (action) {
      case "install":
        return "install";
      case "uninstall":
        return "uninstall";
      case "hold":
        return "hold";
      case "unhold":
        return "unhold";
      case "changeVersion":
        return "change version on";
    }
  };

  const getHeaderVerb = () => {
    switch (action) {
      case "install":
        return "install";
      case "uninstall":
        return "uninstall";
      case "hold":
        return "hold";
      case "unhold":
        return "unhold";
      case "changeVersion":
        return "change version";
    }
  };

  return (
    <div className={classes.container}>
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
              placeholder={`Search ${mapActionToSearch(action)} packages`}
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
                You can {getWarningVerb()} a maximum of{" "}
                {pluralize(MAX_SELECTED_PACKAGES, ["package"], "exact")} in one
                single operation.
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

                  {!isPendingPackages && (
                    <PackageDropdownSearchCount
                      count={packagesResponse.pages.at(-1)?.data.count}
                    />
                  )}
                </div>

                <PackageDropdownSearchList
                  downshiftOptions={downshiftOptions}
                  exact={exact}
                  queryResult={packagesQueryResult}
                  search={search}
                  selectedPackages={selectedItems.map(([item]) => item)}
                />
              </div>
            )}
          </div>
        )}
      </Downshift>

      <div
        className={classNames(
          "p-text--small-caps",
          "u-no-padding",
          classes.header,
        )}
      >{`Packages to ${getHeaderVerb()}`}</div>

      {selectedItems.length ? (
        <ul className="p-list p-autocomplete__result-list u-no-margin--bottom">
          {selectedItems.map((selectedPackage, index) => {
            const handleDelete = () => {
              setSelectedItems(selectedItems.toSpliced(index, 1));
            };

            return action == "changeVersion" ? (
              <PackageSearchDowngradeItem
                key={`${selectedPackage[0].id}${index}`}
                selectedPackage={selectedPackage}
                onDelete={handleDelete}
                instanceIds={instanceIds}
                onItemsUpdate={(items) => {
                  setSelectedItems(
                    selectedItems.toSpliced(index, 1, [
                      selectedPackage[0],
                      items.map((item) => item.value as number),
                    ]),
                  );
                }}
              />
            ) : (
              <PackageDropdownSearchItem
                key={`${selectedPackage[0].id}${index}`}
                selectedPackage={selectedPackage[0]}
                onDelete={handleDelete}
              />
            );
          })}
        </ul>
      ) : (
        <div>No packages have been added yet.</div>
      )}
    </div>
  );
};

export default PackageDropdownSearch;
