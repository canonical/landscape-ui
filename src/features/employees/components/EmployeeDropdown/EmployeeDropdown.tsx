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
  readonly loadingExistingEmployee: boolean;
}

const EmployeeDropdown: FC<EmployeeDropdown> = ({
  employee,
  setEmployee,
  loadingExistingEmployee,
}) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const debug = useDebug();
  const { employees, isFetching } = useGetEmployees(
    {
      search: search,
      with_groups: true,
    },
    {
      enabled: search.length > 2,
    },
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
    if (inputValue.length > 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSearchBoxChange = (value: string) => {
    setInputValue(value);
    if (value.length > 2) {
      setSearch(value);
    }
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
    if (!open && inputValue.length < 3) {
      return "Min 3. characters";
    }
    if (employees.length === 0 && search && !isFetching) {
      return `No employees found by "${search}"`;
    }
    return null;
  };

  const helpText = getHelpText();

  return (
    <div className={classes.container}>
      <Downshift
        onSelect={handleSelectItem}
        itemToString={() => ""}
        isOpen={open}
      >
        {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
          <div className="p-autocomplete">
            <SearchBox
              {...getInputProps()}
              placeholder="Search for employees"
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
                      <small className="u-text-muted">
                        {item.groups?.map((group) => group.name).join(", ")}
                      </small>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        )}
      </Downshift>

      {loadingExistingEmployee && <LoadingState />}

      {employee && (
        <ul className="p-list p-autocomplete__result-list u-no-margin--bottom">
          <li
            className={classNames(
              "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
              classes.selectedContainer,
            )}
            key={employee.id}
          >
            <div>
              <div>{employee.name}</div>
              <span>
                <small className="u-text--muted p-text--small">
                  {employee.groups?.map((group) => group.name).join(", ")}
                </small>
              </span>
            </div>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom"
              onClick={handleDeleteSelectedItem}
            >
              <Icon name={ICONS.delete} />
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default EmployeeDropdown;
