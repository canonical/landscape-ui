import { useCloseTableFilterMenu } from "@/hooks/useCloseTableFilterMenu";
import { Button, ContextualMenu } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import type { SingleFilterProps } from "../../types";
import commonClasses from "../../TableFilter.module.scss";
import { getToggleLabel } from "./helpers";
import { getCommonContextualMenuProps } from "../../helpers";
import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import classes from "./TableFilterSingle.module.scss";

const TableFilterSingle: FC<SingleFilterProps> = ({
  label,
  options,
  disabledOptions,
  hasBadge,
  onSearch,
  selectedItem,
  onItemSelect,
  showSelectionOnToggleLabel = false,
}) => {
  const { handleCloseMenu, rootRef } = useCloseTableFilterMenu();

  const toggleLabel = (
    <>
      <span>
        {getToggleLabel({
          label,
          options,
          otherProps: {
            showSelectionOnToggleLabel,
            selectedItem,
          },
        })}
      </span>
      {hasBadge && (
        <span className={commonClasses.badgeContainer}>
          {selectedItem && (
            <svg
              role="img"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="13" r="6" fill="#666666" />
            </svg>
          )}
        </span>
      )}
    </>
  );

  return (
    <div ref={rootRef}>
      <ContextualMenu
        {...getCommonContextualMenuProps(onSearch)}
        toggleLabel={toggleLabel}
      >
        <span
          className={classNames(classes.container, {
            [classes.hasSearch]: Boolean(onSearch),
          })}
        >
          {onSearch && <SearchBoxWithForm onSearch={onSearch} />}
          <ul className={commonClasses.list}>
            {options.map(({ label: optLabel, value, group }, i) => (
              <li
                key={value}
                className={classNames({
                  [commonClasses.separated]:
                    group &&
                    options[i + 1] !== undefined &&
                    options[i + 1].group !== group,
                })}
              >
                {selectedItem === value ? (
                  <span className={classes.selected}>{optLabel}</span>
                ) : (
                  <Button
                    type="button"
                    appearance="base"
                    className={classes.button}
                    onClick={() => {
                      onItemSelect(value);
                      handleCloseMenu();
                    }}
                    disabled={disabledOptions?.some((o) => o.value === value)}
                  >
                    {optLabel}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </span>
      </ContextualMenu>
    </div>
  );
};

export default TableFilterSingle;
