import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import { Button, Icon, ICONS, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useGetEmployees } from "../../api";
import type { Employee } from "../../types";
import classes from "./EmployeeDropdown.module.scss";
import { DEBOUNCE_DELAY } from "./constants";
import { boldSubstring } from "./helpers";

interface EmployeeDropdown {
  readonly employee: Employee | null;
  readonly setEmployee: (employee: Employee | null) => void;
  readonly error: string | undefined;
}

const EmployeeDropdown: FC<EmployeeDropdown> = ({
  employee,
  setEmployee,
  error,
}) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const debug = useDebug();
  const { employees, isFetching } = useGetEmployees(
    { listenToUrlParams: false },
    { search: search },
    { enabled: search.length > 0 },
  );

  const getAvailableEmployeeSuggestions = (item: Employee): boolean => {
    return employee?.id !== item.id;
  };

  const suggestions = employees.filter(getAvailableEmployeeSuggestions);

  const handleDeleteSelectedItem = () => {
    setEmployee(null);
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

  const handleSelectItem = (item: Employee | null) => {
    if (!item) {
      return;
    }
    setEmployee(item);
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
    if (employees.length === 0 && search && !isFetching) {
      return `No employees found by "${search}"`;
    }
    return null;
  };

  const helpText = getHelpText();

  return (
    <div className={classNames(classes.container, { "is-error": !!error })}>
      <Downshift
        onSelect={handleSelectItem}
        itemToString={() => ""}
        isOpen={open}
      >
        {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
          <div className="p-autocomplete">
            <label
              className="p-form__label"
              htmlFor="employee-searchbox"
              id="employee-searchbox-label"
            >
              Employee
            </label>
            <SearchBox
              {...getInputProps()}
              id="employee-searchbox"
              placeholder="Search for an employee"
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
            {open && (suggestions.length > 0 || isFetching) ? (
              <ul
                className={classNames(
                  "p-list p-card--highlighted u-no-padding u-no-margin--bottom p-autocomplete__suggestions",
                  classes.suggestionsContainer,
                )}
                {...getMenuProps()}
              >
                {isFetching ? (
                  <LoadingState />
                ) : (
                  suggestions.map((item: Employee, index: number) => (
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
                      <div className="u-truncate" data-testid="dropdownElement">
                        {boldSubstring(item.name, search)}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        )}
      </Downshift>

      {!!error && (
        <p
          className={classNames(
            classes.errorMessage,
            "p-form-validation__message is-error",
          )}
        >
          {error}
        </p>
      )}

      {employee && (
        <ul className="p-list p-autocomplete__result-list u-no-margin--bottom">
          <li
            className={classNames(
              "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
              classes.selectedEmployee__container,
            )}
            key={employee.id}
          >
            <span className={classes.selectedEmployee__name}>
              {employee.name}
            </span>
            <Button
              type="button"
              title="Remove"
              appearance="link"
              className={classNames(
                "u-no-margin--bottom",
                classes.selectedEmployee__button,
              )}
              onClick={handleDeleteSelectedItem}
            >
              <Icon
                name={ICONS.delete}
                className={classes.selectedEmployee__icon}
              />
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default EmployeeDropdown;
