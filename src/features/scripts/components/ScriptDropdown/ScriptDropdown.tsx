import LoadingState from "@/components/layout/LoadingState";
import {
  useGetScriptsInfinite,
  useGetSingleScript,
  type Script,
} from "@/features/scripts";
import { Button, Icon, ICONS, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import classes from "./ScriptDropdown.module.scss";
import { DEBOUNCE_DELAY, NEAR_BOTTOM_RATIO, QUERY_LIMIT } from "./constants";
import { boldSubstring } from "./helpers";

interface ScriptDropdownProps {
  readonly script: Script | null | undefined;
  readonly setScript: (script: Script | null) => void;
  readonly existingScriptId?: number;
  readonly errorMessage?: string;
  readonly parentAccessGroup?: string;
}

const ScriptDropdown: FC<ScriptDropdownProps> = ({
  script,
  setScript,
  existingScriptId,
  errorMessage,
  parentAccessGroup,
}) => {
  const {
    value: isOpen,
    setTrue: openDropdown,
    setFalse: closeDropdown,
  } = useBoolean(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [search, setSearch] = useDebounceValue("", DEBOUNCE_DELAY);
  const inputRef = useRef<HTMLInputElement>(null);

  const { script: existingScript, isScriptLoading } = useGetSingleScript(
    existingScriptId || 0,
    {
      enabled: !!existingScriptId,
    },
  );

  useEffect(() => {
    if (existingScriptId && script?.id !== existingScript?.id) {
      setScript(existingScript);
    }
  }, [existingScript]);

  const {
    scripts,
    isPending: isScriptsPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: scriptsError,
  } = useGetScriptsInfinite({
    search,
    limit: QUERY_LIMIT,
    enabled: isOpen || search.length > 0,
    parentAccessGroup,
  });

  if (scriptsError) {
    throw scriptsError;
  }

  const getAvailableScriptSuggestions = (item: Script): boolean => {
    return script?.id !== item.id;
  };

  const suggestions = scripts.filter(getAvailableScriptSuggestions);

  const handleDeleteSelectedItem = () => {
    setScript(null);
  };

  const handleClearSearch = (reopen = true) => {
    setInputValue("");
    setSearch.cancel();
    setSearch("");
    if (reopen) {
      openDropdown();
    }
  };

  const handleDropdownState = () => {
    openDropdown();
  };

  const handleSearchBoxChange = (value: string) => {
    setInputValue(value);
    if (!value) {
      setSearch.cancel();
      setSearch("");
      openDropdown();
      return;
    }
    setSearch(value);
    openDropdown();
  };

  const handleSelectItem = (item: Script | null) => {
    if (!item) {
      return;
    }
    setScript(item);
    closeDropdown();
    handleClearSearch(false);
    inputRef.current?.blur();
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const nearBottom =
      scrollHeight - scrollTop <= clientHeight * NEAR_BOTTOM_RATIO;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const getHelpText = () => {
    if (scripts.length === 0 && search && !isScriptsPending) {
      return `No scripts found by "${search}"`;
    }

    if (existingScriptId) {
      return "Scripts can't be replaced after the profile has been created.";
    }

    return null;
  };

  const helpText = getHelpText();

  return (
    <div
      className={classNames(
        classes.container,
        "p-form__group p-form-validation",
      )}
    >
      <label
        className="is-required p-form__label"
        htmlFor={!existingScriptId ? "script-search" : "script-selected"}
      >
        Script
      </label>
      {!existingScriptId && (
        <Downshift
          onSelect={handleSelectItem}
          itemToString={(item) => (item ? item.title : "")}
          isOpen={isOpen}
          onOuterClick={closeDropdown}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
          }) => (
            <div className="p-autocomplete">
              <SearchBox
                {...getInputProps()}
                id={!existingScriptId ? "script-search" : undefined}
                placeholder="Search for scripts"
                required
                className="u-no-margin--bottom"
                shouldRefocusAfterReset
                externallyControlled
                autocomplete="off"
                value={inputValue}
                ref={inputRef}
                onChange={handleSearchBoxChange}
                onClear={handleClearSearch}
                onBlur={closeDropdown}
                onFocus={handleDropdownState}
              />
              {helpText ? (
                <span className="p-form-help-text">{helpText}</span>
              ) : null}

              {errorMessage && !isOpen ? (
                <div className="is-error">
                  <span
                    className="p-form-validation__message"
                    id="script-error"
                  >
                    <span>{errorMessage}</span>
                  </span>
                </div>
              ) : null}

              {isOpen && (suggestions.length > 0 || isScriptsPending) ? (
                <ul
                  className={classNames(
                    "p-list p-card--highlighted u-no-padding u-no-margin--bottom p-autocomplete__suggestions",
                    classes.suggestionsContainer,
                  )}
                  {...getMenuProps()}
                  onScroll={handleScroll}
                >
                  {isScriptsPending ? (
                    <LoadingState />
                  ) : (
                    <>
                      {suggestions.map((item: Script, index: number) => (
                        <li
                          className={classNames(
                            "p-list__item",
                            classes.pointer,
                            {
                              [classes.highlighted]: highlightedIndex === index,
                            },
                          )}
                          key={item.id}
                          {...getItemProps({
                            item,
                            index,
                          })}
                        >
                          <div
                            className="u-truncate"
                            data-testid="dropdownElement"
                          >
                            {boldSubstring(item.title, inputValue)}
                          </div>
                        </li>
                      ))}
                      {isFetchingNextPage && (
                        <li className="p-list__item u-align--center">
                          <LoadingState />
                        </li>
                      )}
                    </>
                  )}
                </ul>
              ) : null}
            </div>
          )}
        </Downshift>
      )}
      {isScriptLoading ? <LoadingState /> : null}
      {script && (
        <div
          id="script-selected"
          className={classNames(
            "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
            classes.selectedScript__container,
            {
              [classes.marginTop]: !existingScriptId,
            },
          )}
          key={script.id}
        >
          <span className={classes.selectedScript__name}>
            <b>{script.title}</b>
          </span>
          {!existingScriptId ? (
            <Button
              type="button"
              title="Remove"
              appearance="base"
              className={classNames(
                classes.selectedScript__button,
                "u-no-margin--bottom u-no-margin--right",
              )}
              onClick={handleDeleteSelectedItem}
            >
              <Icon
                name={ICONS.delete}
                className={classes.selectedScript__icon}
              />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ScriptDropdown;
