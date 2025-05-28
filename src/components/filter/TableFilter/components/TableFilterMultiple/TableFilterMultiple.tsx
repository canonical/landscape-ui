import {
  Badge,
  Button,
  ContextualMenu,
  Input,
} from "@canonical/react-components";
import classNames from "classnames";
import type { ChangeEvent, FC } from "react";
import commonClasses from "../../TableFilter.module.scss";
import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import type { MultipleFilterProps } from "../../types";
import { getCommonContextualMenuProps } from "../../helpers";
import classes from "./TableFilterMultiple.module.scss";

const TableFilterMultiple: FC<MultipleFilterProps> = ({
  label,
  options,
  disabledOptions,
  hasBadge,
  onSearch,
  selectedItems,
  onItemsSelect,
  hideSelectAllButton = false,
  showSelectedItemCount = false,
}) => {
  const toggleLabel = (
    <>
      <span>{label}</span>
      {hasBadge && (
        <span
          className={classNames(commonClasses.badgeContainer, {
            [commonClasses.multiple]: options.length > 9,
          })}
        >
          {selectedItems.length > 0 && (
            <Badge
              value={selectedItems.length}
              className={commonClasses.badge}
            />
          )}
        </span>
      )}
    </>
  );

  return (
    <ContextualMenu
      {...getCommonContextualMenuProps(onSearch)}
      toggleLabel={toggleLabel}
    >
      <span className={classes.container}>
        {onSearch && <SearchBoxWithForm onSearch={onSearch} />}
        <ul className={commonClasses.list}>
          {options.map(({ label: optLabel, value, group }, i) => (
            <li
              key={value}
              className={classNames(commonClasses.listItem, {
                [commonClasses.separated]:
                  group &&
                  options[i + 1] !== undefined &&
                  options[i + 1].group !== group,
              })}
            >
              <Input
                type="checkbox"
                label={optLabel}
                labelClassName="u-no-padding--top u-no-margin--bottom"
                value={value}
                checked={selectedItems.includes(value)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const next = e.target.checked
                    ? [...selectedItems, value]
                    : selectedItems.filter((val) => val !== value);
                  onItemsSelect(next);
                }}
                disabled={disabledOptions?.some(
                  (option) => option.value === value,
                )}
              />
            </li>
          ))}
        </ul>
      </span>
      <span
        className={classNames(classes.footer, {
          [classes.hideSelectAllButton]: hideSelectAllButton,
        })}
      >
        {!hideSelectAllButton && (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              onItemsSelect(options.map((option) => option.value));
            }}
          >
            Select all
          </Button>
        )}
        {showSelectedItemCount ? (
          <span className="u-text--muted">
            {`${selectedItems.length} of ${options.length} selected`}
          </span>
        ) : (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              onItemsSelect([]);
            }}
          >
            Clear
          </Button>
        )}
      </span>
    </ContextualMenu>
  );
};

export default TableFilterMultiple;
