import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { Form, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useGetSavedSearches } from "../../api";
import type { SavedSearch } from "../../types";
import SavedSearchList from "../SavedSearchList";
import SearchInfoBox from "../SearchInfoBox";
import SearchPrompt from "../SearchPrompt";
import { getFilteredSavedSearches } from "./helpers";
import classes from "./SearchBoxWithSavedSearches.module.scss";

interface SearchBoxWithSavedSearchesProps {
  readonly onHelpButtonClick: () => void;
  readonly onChange?: () => void;
}

const SearchBoxWithSavedSearches: FC<SearchBoxWithSavedSearchesProps> = ({
  onHelpButtonClick,
  onChange,
}) => {
  const { query, setPageParams } = usePageParams();
  const [inputText, setInputText] = useState(query ?? "");
  const [showDropdown, setShowDropdown] = useState(false);

  const { savedSearches, isLoadingSavedSearches } = useGetSavedSearches();

  const containerRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  const handleDropdownClose = (event: MouseEvent | TouchEvent | FocusEvent) => {
    const portalElement = document.querySelector(".p-modal");
    if (portalElement && portalElement.contains(event.target as Node)) {
      return;
    }
    setShowDropdown(false);
  };

  useOnClickOutside(containerRef, handleDropdownClose);

  useEffect(() => {
    setInputText(query ?? "");
  }, [query]);

  const filteredSearches = useMemo(
    () =>
      getFilteredSavedSearches({
        inputText,
        savedSearches,
        search: query,
      }),
    [savedSearches, inputText, query],
  );

  const handleSearch = () => {
    const nextQuery = inputText.trim();

    const searches = getFilteredSavedSearches({
      inputText: "",
      savedSearches,
      search: query,
    });

    const prefix = searches.some(
      ({ name }) => name.toLowerCase() === nextQuery.toLowerCase(),
    )
      ? "search:"
      : "";

    setPageParams({ query: `${prefix}${nextQuery}` });
    onChange?.();
  };

  const handleSavedSearchClick = (savedSearch: SavedSearch) => {
    setPageParams({ query: `search:${savedSearch.name}` });
    onChange?.();
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
        onClick={() => {
          setShowDropdown(true);
        }}
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
              onChange={(inputValue) => {
                setInputText(inputValue);
              }}
              onClear={() => {
                setInputText("");
                setPageParams({ query: "" });
                onChange?.();
              }}
              onSearch={handleSearch}
              onClick={() => {
                setShowDropdown(true);
              }}
              onKeyUp={handleKeysOnSearchBox}
            />
          </div>
        </Form>
        <SearchInfoBox onHelpButtonClick={onHelpButtonClick} />
      </div>
      {showDropdown && isLoadingSavedSearches && <LoadingState />}
      {showDropdown && !isLoadingSavedSearches && (
        <div className="p-search-and-filter__panel">
          <SearchPrompt
            onSearchSave={() => {
              setInputText("");
            }}
            search={inputText.trim()}
          />

          <SavedSearchList
            onSavedSearchClick={handleSavedSearchClick}
            onManageSearches={() => {
              setShowDropdown(false);
            }}
            onSavedSearchRemove={() => {
              setShowDropdown(true);
            }}
            savedSearches={filteredSearches}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBoxWithSavedSearches;
