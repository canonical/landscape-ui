import useFetch from "@/hooks/useFetch";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { pluralizeWithCount } from "@/utils/_helpers";
import { SearchBox, Switch } from "@canonical/react-components";
import { useInfiniteQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import { useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import type { GetPackagesParams } from "../../hooks";
import type { Package, PackageAction, SelectedVersion } from "../../types";
import type { SelectedPackage } from "../../types";
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

interface PackageDropdownSearchProps {
  readonly instanceIds: number[];
  readonly selectedPackages: SelectedPackage[];
  readonly setSelectedPackages: (packages: SelectedPackage[]) => void;
  readonly action: PackageAction;
}

const PackageDropdownSearch: FC<PackageDropdownSearchProps> = ({
  instanceIds,
  selectedPackages,
  setSelectedPackages,
  action,
}) => {
  const authFetch = useFetch();

  const [search, setSearch] = useDebounceValue("", DEBOUNCE_DELAY);
  const [inputValue, setInputValue] = useState("");
  const { value: exact, toggle: toggleExact } = useBoolean();

  const { value: isOpen, setFalse: close, setTrue: open } = useBoolean();

  const query = instanceIds.map((id) => `id:${id}`).join(" OR ");
  const { available, installed, upgrade, held } =
    mapActionToQueryParams(action);

  const queryParams: GetPackagesParams = {
    query,
    available: available,
    installed: installed,
    upgrade: upgrade,
    held: held,
    limit: QUERY_LIMIT,
  };

  if (exact) {
    queryParams.names = [search];
  } else {
    queryParams.search = search;
  }

  const packagesQueryResult = useInfiniteQuery({
    queryKey: ["packages", queryParams],
    queryFn: async ({ pageParam }) => {
      return authFetch.get<ApiPaginatedResponse<Package>>("packages", {
        params: { ...queryParams, offset: pageParam * QUERY_LIMIT },
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPageParam = lastPageParam + 1;

      if (lastPage.data.count > nextPageParam * QUERY_LIMIT) {
        return nextPageParam;
      }
    },
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

    setSelectedPackages([
      ...selectedPackages,
      { name: item.name, id: item.id, versions: [] },
    ]);
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
                {pluralizeWithCount(MAX_SELECTED_PACKAGES, "package")} in one
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
                  hasOneInstance={instanceIds.length === 1}
                  queryResult={packagesQueryResult}
                  search={search}
                  selectedPackages={selectedPackages}
                />
              </div>
            )}
          </div>
        )}
      </Downshift>

      <ul className="p-list p-autocomplete__result-list u-no-margin--bottom">
        {selectedPackages.length
          ? selectedPackages.map((selectedPackage, index) => {
              const handleDelete = () => {
                setSelectedPackages(selectedPackages.toSpliced(index, 1));
              };

              const handleUpdateVersions = (versions: SelectedVersion[]) => {
                setSelectedPackages([
                  ...selectedPackages.slice(0, index),
                  {
                    name: selectedPackage.name,
                    id: selectedPackage.id,
                    versions: versions,
                  },
                  ...selectedPackages.slice(index + 1),
                ]);
              };

              return action == "downgrade" ? (
                <PackageSearchDowngradeItem
                  key={`${selectedPackage.id}${index}`}
                  selectedPackage={selectedPackage}
                  onDelete={handleDelete}
                  onUpdateVersions={handleUpdateVersions}
                  query={query}
                />
              ) : (
                <PackageDropdownSearchItem
                  key={`${selectedPackage.id}${index}`}
                  selectedPackage={selectedPackage}
                  onDelete={handleDelete}
                  onUpdateVersions={handleUpdateVersions}
                  query={query}
                  action={action}
                />
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default PackageDropdownSearch;
