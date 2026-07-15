import { pluralize } from "@/utils/_helpers";
import { SearchBox, Switch } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import { useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import type { Package, PackageAction } from "../../types";
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
import { FilterState } from "../../types/FilterState";

interface PackageDropdownSearchProps {
  readonly instanceIds: number[];
  readonly selectedPackages: Package[];
  readonly setSelectedPackages: (packages: Package[]) => void;
  readonly action: PackageAction;
}

const PackageDropdownSearch: FC<PackageDropdownSearchProps> = ({
  instanceIds,
  selectedPackages,
  setSelectedPackages,
  action,
}) => {
  const [search, setSearch] = useDebounceValue("", DEBOUNCE_DELAY);
  const [inputValue, setInputValue] = useState("");
  const { value: exact, toggle: toggleExact } = useBoolean();

  const { value: isOpen, setFalse: close, setTrue: open } = useBoolean();

  const { available, installed, upgrade, held } =
    mapActionToQueryParams(action);

  const computerQuery = instanceIds.map((id) => `id:${id}`).join(" OR ");

  const queryParams: SearchPackagesRequest = {
    computer_query: computerQuery,
    available: available ? FilterState.TRUE : FilterState.FALSE,
    installed: installed ? FilterState.TRUE : FilterState.FALSE,
    upgrade: upgrade ? FilterState.TRUE : FilterState.FALSE,
    held: held ? FilterState.TRUE : FilterState.FALSE,
    limit: QUERY_LIMIT,
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

    setSelectedPackages([...selectedPackages, item]);
    clearSearchBox();
    close();
  };

  const isOverLimit = selectedPackages.length >= MAX_SELECTED_PACKAGES;

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
                You can {action} a maximum of{" "}
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
                  selectedPackages={selectedPackages}
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
      >{`Packages to ${action}`}</div>

      {selectedPackages.length ? (
        <ul className="p-list p-autocomplete__result-list u-no-margin--bottom">
          {selectedPackages.map((selectedPackage, index) => {
            const handleDelete = () => {
              setSelectedPackages(selectedPackages.toSpliced(index, 1));
            };

            return action == "downgrade" ? (
              <PackageSearchDowngradeItem
                key={`${selectedPackage.id}${index}`}
                selectedPackage={selectedPackage}
                onDelete={handleDelete}
                query={computerQuery}
              />
            ) : (
              <PackageDropdownSearchItem
                key={`${selectedPackage.id}${index}`}
                selectedPackage={selectedPackage}
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
