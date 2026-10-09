import { DEBOUNCE_DELAY } from "@/constants";
import { pluralize, toInstanceQuery } from "@/utils/_helpers";
import { SearchBox, Switch } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import { useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import type {
  Package,
  PackageChangePlanActionType,
  PackageWithVersions,
} from "../../types";
import PackageDropdownSearchCount from "./components/PackageDropdownSearchCount";
import PackageDropdownSearchItem from "./components/PackageDropdownSearchItem";
import PackageDropdownSearchList from "./components/PackageDropdownSearchList";
import { MAX_SELECTED_PACKAGES, QUERY_LIMIT } from "./constants";
import classes from "./PackageDropdownSearch.module.scss";
import {
  mapActionTypeToQueryParams,
  mapActionTypeToSearch,
} from "../../helpers";
import PackageSearchDowngradeItem from "./components/PackageSearchDowngradeItem";
import type { SearchPackagesRequest } from "../../api/useSearchPackages";
import useSearchPackages from "../../api/useSearchPackages";

interface PackageDropdownSearchProps {
  readonly instanceIds: number[];
  readonly selectedItems: PackageWithVersions[];
  readonly setSelectedItems: (packages: PackageWithVersions[]) => void;
  readonly actionType: Exclude<PackageChangePlanActionType, "upgrade">;
}

const PackageDropdownSearch: FC<PackageDropdownSearchProps> = ({
  instanceIds,
  selectedItems,
  setSelectedItems,
  actionType,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [search, setSearch] = useDebounceValue("", DEBOUNCE_DELAY);
  const { value: exact, toggle: toggleExact } = useBoolean();

  const { value: isOpen, setFalse: close, setTrue: open } = useBoolean();

  const queryParams: SearchPackagesRequest = {
    computer_query: toInstanceQuery(instanceIds),
    limit: QUERY_LIMIT,
    ...mapActionTypeToQueryParams(actionType),
  };

  if (exact) {
    queryParams.names = search;
  } else {
    queryParams.text = search || undefined;
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
    if (!value) {
      setSearch.cancel();
      setSearch("");
      return;
    }
    setSearch(value);
    open();
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
    switch (actionType) {
      case "install":
        return "install";
      case "remove":
        return "uninstall";
      case "hold":
        return "hold";
      case "unhold":
        return "unhold";
      case "change_version":
        return "change version on";
    }
  };

  const getHeaderVerb = () => {
    switch (actionType) {
      case "install":
        return "install";
      case "remove":
        return "uninstall";
      case "hold":
        return "hold";
      case "unhold":
        return "unhold";
      case "change_version":
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
              placeholder={`Search ${mapActionTypeToSearch(actionType)} packages`}
              className="u-no-margin--bottom"
              shouldRefocusAfterReset
              externallyControlled
              autocomplete="off"
              value={inputValue}
              onChange={handleSearchBoxChange}
              onClear={clearSearchBox}
              onClick={open}
              onFocus={open}
              onBlur={close}
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

            return actionType == "change_version" ? (
              <PackageSearchDowngradeItem
                key={`${selectedPackage[0].id}`}
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
                actionType={actionType}
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
