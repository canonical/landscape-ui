import classNames from "classnames";
import { FC, KeyboardEvent, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Form, SearchBox } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { useSavedSearches } from "../../hooks";
import SavedSearchList from "../SavedSearchList";
import SearchInfoBox from "../SearchInfoBox";
import SearchPrompt from "../SearchPrompt";
import { SavedSearch } from "../../types";
import classes from "./SearchBoxWithSavedSearches.module.scss";
import { usePageParams } from "@/hooks/usePageParams";
import { getFilteredSavedSearches } from "./helpers";

interface SearchBoxWithSavedSearchesProps {
  onHelpButtonClick: () => void;
}

const SearchBoxWithSavedSearches: FC<SearchBoxWithSavedSearchesProps> = ({
  onHelpButtonClick,
}) => {
  const { search, setPageParams } = usePageParams();
  const [inputText, setInputText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { getSavedSearchesQuery } = useSavedSearches();

  const containerRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  useOnClickOutside(containerRef, handleDropdownClose);

  const {
    data: getSavedSearchesQueryResult,
    isLoading: getSavedSearchesQueryLoading,
  } = getSavedSearchesQuery();

  const filteredSearches = useMemo(
    () =>
      getFilteredSavedSearches({
        inputText,
        savedSearches: getSavedSearchesQueryResult?.data,
        search,
      }),
    [getSavedSearchesQueryResult, inputText, search],
  );

  const handleSearch = () => {
    if (!inputText) {
      return;
    }

    const searches = getFilteredSavedSearches({
      inputText: "",
      savedSearches: getSavedSearchesQueryResult?.data,
      search,
    });

    const prefix = searches.some(
      ({ name }) => name.toLowerCase() === inputText.trim().toLowerCase(),
    )
      ? "search:"
      : "";

    setPageParams({
      search: search
        ? `${search},${prefix}${inputText}`
        : `${prefix}${inputText}`,
    });

    setInputText("");
  };

  const handleSavedSearchClick = (savedSearch: SavedSearch) => {
    setPageParams({
      search: search
        ? `${search},search:${savedSearch.name}`
        : `search:${savedSearch.name}`,
    });
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
        <SearchInfoBox onHelpButtonClick={onHelpButtonClick} />
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
