import LoadingState from "@/components/layout/LoadingState";
import {
  useGetScripts,
  useGetSingleScript,
  type Script,
} from "@/features/scripts";
import useDebug from "@/hooks/useDebug";
import { Button, Icon, ICONS, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import classes from "./ScriptDropdown.module.scss";
import { DEBOUNCE_DELAY } from "./constants";
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
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

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

  const debug = useDebug();
  const { scripts, isScriptsLoading } = useGetScripts(
    {
      listenToUrlParams: false,
    },
    {
      search: search,
      script_type: "active",
      limit: 20,
      offset: 0,
      parent_access_group: parentAccessGroup,
    },
    {
      enabled: search.length > 0,
    },
  );

  const getAvailableScriptSuggestions = (item: Script): boolean => {
    return script?.id !== item.id;
  };

  const suggestions = scripts.filter(getAvailableScriptSuggestions);

  const handleDeleteSelectedItem = () => {
    setScript(null);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearch("");
  };

  const handleDropdownState = () => {
    setOpen(Boolean(inputValue.length));
  };

  const handleSearchBoxChange = (value: string) => {
    setInputValue(value);
    setSearch(value);
  };

  const debouncedSearch = useDebounceCallback(() => {
    try {
      handleDropdownState();
    } catch (err) {
      debug(err);
    }
  }, DEBOUNCE_DELAY);

  const handleSelectItem = (item: Script | null) => {
    if (!item) {
      return;
    }
    setScript(item);
    setOpen(false);
    handleClearSearch();
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.currentTarget.blur();
    } else {
      debouncedSearch();
    }
  };

  const getHelpText = () => {
    if (scripts.length === 0 && search && !isScriptsLoading) {
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
          itemToString={() => ""}
          isOpen={open}
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
                onChange={handleSearchBoxChange}
                onClear={handleClearSearch}
                onBlur={closeDropdown}
                onFocus={handleDropdownState}
                onKeyUp={handleOnKeyUp}
              />
              {helpText ? (
                <span className="p-form-help-text">{helpText}</span>
              ) : null}

              {errorMessage && !open ? (
                <div className="is-error">
                  <span
                    className="p-form-validation__message"
                    id="script-error"
                  >
                    <span>{errorMessage}</span>
                  </span>
                </div>
              ) : null}

              {open && (suggestions.length > 0 || isScriptsLoading) ? (
                <ul
                  className={classNames(
                    "p-list p-card--highlighted u-no-padding u-no-margin--bottom p-autocomplete__suggestions",
                    classes.suggestionsContainer,
                  )}
                  {...getMenuProps()}
                >
                  {isScriptsLoading ? (
                    <LoadingState />
                  ) : (
                    suggestions.map((item: Script, index: number) => (
                      <li
                        className={classNames("p-list__item", classes.pointer, {
                          [classes.highlighted]: highlightedIndex === index,
                        })}
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
                          {boldSubstring(item.title, search)}
                        </div>
                      </li>
                    ))
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
