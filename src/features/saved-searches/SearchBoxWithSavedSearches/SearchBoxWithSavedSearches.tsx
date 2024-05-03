import classNames from "classnames";
import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Form, SearchBox } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import SavedSearchList from "@/features/saved-searches/SavedSearchList";
import SearchChips from "@/features/saved-searches/SearchChips";
import SearchInfoBox from "@/features/saved-searches/SearchInfoBox";
import SearchPrompt from "@/features/saved-searches/SearchPrompt";
import { ExtendedSearchAndFilterChip } from "@/features/saved-searches/types";
import { SavedSearch } from "@/types/SavedSearch";
import classes from "./SearchBoxWithSavedSearches.module.scss";

interface SearchBoxWithSavedSearchesProps {
  onHelpButtonClick: () => void;
  returnSearchData: (searchData: ExtendedSearchAndFilterChip[]) => void;
  existingSearchData?: ExtendedSearchAndFilterChip[];
}

const SearchBoxWithSavedSearches: FC<SearchBoxWithSavedSearchesProps> = ({
  onHelpButtonClick,
  returnSearchData,
  existingSearchData = [],
}) => {
  const [inputText, setInputText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchData, setSearchData] = useState<ExtendedSearchAndFilterChip[]>(
    [],
  );
  const [overflowingChipsAmount, setOverflowingChipsAmount] = useState(0);

  const { getSavedSearchesQuery } = useSavedSearches();

  const containerRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    returnSearchData(searchData);
  }, [searchData]);

  useEffect(() => {
    setSearchData((prevState) => [...existingSearchData, ...prevState]);
  }, [existingSearchData.length]);

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  useOnClickOutside(containerRef, handleDropdownClose);

  const handleChipDismiss = (chipValue: string) => {
    setSearchData((prevState) =>
      prevState.filter(({ value }) => value !== chipValue),
    );
  };

  const {
    data: getSavedSearchesQueryResult,
    isLoading: getSavedSearchesQueryLoading,
  } = getSavedSearchesQuery();

  const filteredSearches = useMemo(() => {
    if (!getSavedSearchesQueryResult) {
      return [];
    }

    if (!inputText && !searchData.length) {
      return getSavedSearchesQueryResult.data;
    }

    return getSavedSearchesQueryResult.data
      .filter(({ search }) => searchData.every(({ value }) => value !== search))
      .filter(
        ({ title, search }) =>
          title.toLowerCase().includes(inputText.trim().toLowerCase()) ||
          search.toLowerCase().includes(inputText.trim().toLowerCase()),
      );
  }, [getSavedSearchesQueryResult, inputText, searchData]);

  const handleSearch = () => {
    if (!inputText) {
      return;
    }

    setSearchData((prevState) => [
      ...prevState,
      { value: inputText, quoteValue: true },
    ]);
    setInputText("");
  };

  const handleSavedSearchClick = (savedSearch: SavedSearch) => {
    setSearchData((prevState) => [
      ...prevState,
      { value: savedSearch.search, lead: "search", title: savedSearch.name },
    ]);
  };

  const handleKeysOnSearchBox = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (showDropdown) {
      if (key === "Escape") {
        setShowDropdown(false);
      }

      if (key === "Enter") {
        handleSearch();
      }
    } else {
      if (key === "Enter") {
        setShowDropdown(true);
      }
    }
  };

  return (
    <div className="p-search-and-filter" ref={containerRef}>
      <div
        className={classNames(
          "p-search-and-filter__search-container",
          classes.searchContainer,
        )}
        aria-expanded={showDropdown}
        ref={chipsContainerRef}
        onClick={() => setShowDropdown(true)}
      >
        <SearchChips
          containerRef={chipsContainerRef}
          onDismiss={handleChipDismiss}
          onOverflowingItemsAmountChange={(amount) =>
            setOverflowingChipsAmount(amount)
          }
          searchData={searchData}
        />
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
          className={classNames("p-search-and-filter__box", classes.form)}
        >
          <div className={classes.searchBoxContainer}>
            <SearchBox
              externallyControlled
              shouldRefocusAfterReset
              autocomplete="off"
              className={classes.input}
              value={inputText}
              onChange={(inputValue) => setInputText(inputValue)}
              onClear={() => setInputText("")}
              onSearch={handleSearch}
              onClick={() => setShowDropdown(true)}
              onKeyUp={handleKeysOnSearchBox}
            />
          </div>
        </Form>
        <SearchInfoBox
          isExpanded={showDropdown}
          onHelpButtonClick={onHelpButtonClick}
          overflowingChipsAmount={overflowingChipsAmount}
        />
      </div>
      {showDropdown && getSavedSearchesQueryLoading && <LoadingState />}
      {showDropdown && !getSavedSearchesQueryLoading && (
        <div className="p-search-and-filter__panel">
          <SearchPrompt
            onSearchSave={() => setInputText("")}
            search={inputText.trim()}
          />

          <SavedSearchList
            onSavedSearchClick={handleSavedSearchClick}
            onSavedSearchRemove={() => setShowDropdown(true)}
            savedSearches={filteredSearches}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBoxWithSavedSearches;
