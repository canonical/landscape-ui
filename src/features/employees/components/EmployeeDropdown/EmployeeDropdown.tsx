import LoadingState from "@/components/layout/LoadingState";
import { Button, Icon, ICONS, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import Downshift from "downshift";
import type { FC } from "react";
import React, { useRef, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import { useGetEmployeesInfinite } from "../../api";
import type { Employee } from "../../types";
import classes from "./EmployeeDropdown.module.scss";
import { DEBOUNCE_DELAY, NEAR_BOTTOM_RATIO, QUERY_LIMIT } from "./constants";
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
  const {
    value: isOpen,
    setTrue: openDropdown,
    setFalse: closeDropdown,
  } = useBoolean(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [search, setSearch] = useDebounceValue("", DEBOUNCE_DELAY);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    employees,
    isPending: isEmployeesPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: employeesError,
  } = useGetEmployeesInfinite({
    search,
    limit: QUERY_LIMIT,
    enabled: isOpen,
  });

  if (employeesError) {
    throw employeesError;
  }

  const getAvailableEmployeeSuggestions = (item: Employee): boolean => {
    return employee?.id !== item.id;
  };

  const suggestions = employees.filter(getAvailableEmployeeSuggestions);

  const handleDeleteSelectedItem = () => {
    setEmployee(null);
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

  const handleSelectItem = (item: Employee | null) => {
    if (!item) {
      return;
    }
    setEmployee(item);
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
    if (employees.length === 0 && search && !isEmployeesPending) {
      return `No employees found by "${search}"`;
    }
    return null;
  };

  const helpText = getHelpText();

  return (
    <div className={classNames(classes.container, { "is-error": !!error })}>
      <Downshift
        onSelect={handleSelectItem}
        itemToString={(item) => (item ? item.name : "")}
        isOpen={isOpen}
        onOuterClick={closeDropdown}
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
              ref={inputRef}
              onChange={handleSearchBoxChange}
              onClear={handleClearSearch}
              onBlur={closeDropdown}
              onFocus={handleDropdownState}
            />
            {helpText ? (
              <span className="p-form-help-text">{helpText}</span>
            ) : null}
            {isOpen && (suggestions.length > 0 || isEmployeesPending) ? (
              <ul
                className={classNames(
                  "p-list p-card--highlighted u-no-padding u-no-margin--bottom p-autocomplete__suggestions",
                  classes.suggestionsContainer,
                )}
                {...getMenuProps()}
                onScroll={handleScroll}
              >
                {isEmployeesPending ? (
                  <LoadingState />
                ) : (
                  <>
                    {suggestions.map((item: Employee, index: number) => (
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
                          {boldSubstring(item.name, inputValue)}
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
