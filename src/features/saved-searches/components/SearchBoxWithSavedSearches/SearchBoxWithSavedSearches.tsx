import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { Form, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, FocusEvent, KeyboardEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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

const SAVED_SEARCHES_PANEL_LABEL = "Saved searches";

const isInsideModalPortal = (node: Node): boolean => {
  const portalElement = document.querySelector(".p-modal");
  return Boolean(portalElement?.contains(node));
};

const SearchBoxWithSavedSearches: FC<SearchBoxWithSavedSearchesProps> = ({
  onHelpButtonClick,
  onChange,
}) => {
  const { query, setPageParams } = usePageParams();
  const [inputText, setInputText] = useState(query);
  const [showDropdown, setShowDropdown] = useState(false);

  const { savedSearches, isLoadingSavedSearches } = useGetSavedSearches();

  const containerRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suppressFocusOpenRef = useRef(false);
  const panelId = useId();
  const itemIdPrefix = `${panelId}-item`;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeDropdown = () => {
    setShowDropdown(false);
    setActiveIndex(null);
  };

  const handleDropdownClose = (event: MouseEvent | TouchEvent | FocusEvent) => {
    if (isInsideModalPortal(event.target as Node)) {
      return;
    }
    closeDropdown();
  };

  useOnClickOutside(containerRef, handleDropdownClose);

  const handleContainerBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) {
      return;
    }
    if (next && isInsideModalPortal(next)) {
      return;
    }
    closeDropdown();
  };

  const handleContainerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && showDropdown) {
      event.stopPropagation();
      closeDropdown();
      if (
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        suppressFocusOpenRef.current = true;
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    setInputText(query);
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

  // Clamp during render so a removed saved search doesn't leave a stale highlight.
  const effectiveActiveIndex =
    activeIndex !== null && activeIndex < filteredSearches.length
      ? activeIndex
      : null;

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
      if (key === "Enter") {
        const highlighted =
          effectiveActiveIndex !== null
            ? filteredSearches[effectiveActiveIndex]
            : undefined;
        if (highlighted) {
          handleSavedSearchClick(highlighted);
        } else {
          handleSearch();
        }
      }
    } else if (key === "Enter") {
      setShowDropdown(true);
    }
  };

  const handleArrowKeysOnSearchBox = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    const itemCount = filteredSearches.length;

    if (event.key === "ArrowDown") {
      if (!showDropdown) {
        setShowDropdown(true);
        return;
      }
      if (itemCount === 0) {
        return;
      }
      event.preventDefault();
      setActiveIndex((current) => {
        if (current === null) {
          return 0;
        }
        return Math.min(current + 1, itemCount - 1);
      });
    } else if (event.key === "ArrowUp") {
      if (!showDropdown || itemCount === 0) {
        return;
      }
      event.preventDefault();
      setActiveIndex((current) => {
        if (current === null) {
          return itemCount - 1;
        }
        return Math.max(current - 1, 0);
      });
    } else if (event.key === "Home" && showDropdown && itemCount > 0) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && showDropdown && itemCount > 0) {
      event.preventDefault();
      setActiveIndex(itemCount - 1);
    }
  };

  return (
    <div
      className="p-search-and-filter"
      ref={containerRef}
      onBlur={handleContainerBlur}
      onKeyDown={handleContainerKeyDown}
    >
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
              ref={inputRef}
              externallyControlled
              shouldRefocusAfterReset
              autocomplete="off"
              className={classes.input}
              value={inputText}
              aria-expanded={showDropdown}
              aria-controls={showDropdown ? panelId : undefined}
              aria-activedescendant={
                showDropdown && effectiveActiveIndex !== null
                  ? `${itemIdPrefix}-${effectiveActiveIndex}`
                  : undefined
              }
              onChange={(inputValue) => {
                setInputText(inputValue);
                setActiveIndex(null);
              }}
              onClear={() => {
                setInputText("");
                setActiveIndex(null);
                setPageParams({ query: "" });
                onChange?.();
              }}
              onSearch={handleSearch}
              onClick={() => {
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (suppressFocusOpenRef.current) {
                  suppressFocusOpenRef.current = false;
                  return;
                }
                setShowDropdown(true);
              }}
              onKeyDown={handleArrowKeysOnSearchBox}
              onKeyUp={handleKeysOnSearchBox}
            />
          </div>
        </Form>
        <SearchInfoBox onHelpButtonClick={onHelpButtonClick} />
      </div>
      {showDropdown && isLoadingSavedSearches && <LoadingState />}
      {showDropdown && !isLoadingSavedSearches && (
        <div
          id={panelId}
          role="group"
          aria-label={SAVED_SEARCHES_PANEL_LABEL}
          className="p-search-and-filter__panel"
        >
          <SearchPrompt
            onSearchSave={() => {
              setInputText("");
            }}
            search={inputText.trim()}
          />

          <SavedSearchList
            onSavedSearchClick={handleSavedSearchClick}
            onManageSearches={closeDropdown}
            onSavedSearchRemove={() => {
              setShowDropdown(true);
            }}
            savedSearches={filteredSearches}
            activeIndex={effectiveActiveIndex}
            itemIdPrefix={itemIdPrefix}
          />
          {filteredSearches.length > 0 && (
            <p
              className={classNames(
                "p-text--small u-text--muted u-no-margin--bottom",
                classes.keyboardHint,
              )}
            >
              Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to
              select, <kbd>Esc</kbd> to close
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBoxWithSavedSearches;
