import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import {
  Badge,
  Button,
  ContextualMenu,
  Input,
} from "@canonical/react-components";
import classNames from "classnames";
import type { ChangeEvent, FC } from "react";
import { getToggleLabel } from "./helpers";
import classes from "./TableFilter.module.scss";
import type { TableFilterProps } from "./types";

const TableFilter: FC<TableFilterProps> = ({
  disabledOptions,
  hasBadge,
  hasToggleIcon,
  label,
  options,
  onSearch,
  position = "left",
  ...otherProps
}) => {
  const handleToggle =
    ({
      onItemsSelect,
      selectedItems,
    }: {
      onItemsSelect: (items: string[]) => void;
      selectedItems: string[];
    }) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onItemsSelect(
        selectedItems.includes(event.target.value)
          ? selectedItems.filter((item) => item !== event.target.value)
          : [...selectedItems, event.target.value],
      );
    };

  return (
    <ContextualMenu
      autoAdjust={true}
      toggleAppearance="base"
      toggleLabel={
        <>
          <span>
            {getToggleLabel({
              label,
              options,
              otherProps,
            })}
          </span>
          {hasBadge && otherProps.multiple && (
            <span
              className={classNames(classes.badgeContainer, {
                [classes.multiple]: options.length > 9,
              })}
            >
              {otherProps.selectedItems.length > 0 && (
                <Badge
                  value={otherProps.selectedItems.length}
                  className={classes.badge}
                />
              )}
            </span>
          )}
          {hasBadge && !otherProps.multiple && (
            <span className={classes.badgeContainer}>
              {otherProps.selectedItem && (
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
      }
      toggleClassName={classes.toggle}
      hasToggleIcon={hasToggleIcon}
      dropdownClassName={classes.dropdown}
      position={position}
      onToggleMenu={(isOpen) => {
        if (isOpen && onSearch) {
          onSearch("");
        }
      }}
    >
      <span
        className={classNames(classes.container, {
          [classes.multiple]: otherProps.multiple,
          [classes.horizontalPadding]: Boolean(otherProps.multiple || onSearch),
        })}
      >
        {onSearch && <SearchBoxWithForm onSearch={onSearch} />}
        <ul className={classes.list}>
          {options.map(({ label: optionLabel, value, group }, index) => (
            <li
              key={value}
              className={classNames({
                [classes.listItem]: otherProps.multiple,
                [classes.separated]:
                  group &&
                  options[index + 1] !== undefined &&
                  options[index + 1].group !== group,
              })}
            >
              {otherProps.multiple && (
                <Input
                  type="checkbox"
                  label={optionLabel}
                  labelClassName="u-no-padding--top u-no-margin--bottom"
                  value={value}
                  onChange={handleToggle(otherProps)}
                  checked={otherProps.selectedItems.includes(value)}
                  disabled={disabledOptions?.some(
                    (option) => option.value === value,
                  )}
                />
              )}
              {!otherProps.multiple && otherProps.selectedItem !== value && (
                <Button
                  type="button"
                  appearance="base"
                  className={classes.button}
                  onClick={() => {
                    otherProps.onItemSelect(value);
                  }}
                  disabled={disabledOptions?.some(
                    (option) => option.value === value,
                  )}
                >
                  {optionLabel}
                </Button>
              )}
              {!otherProps.multiple && otherProps.selectedItem === value && (
                <span className={classes.selected}>{label}</span>
              )}
            </li>
          ))}
        </ul>
      </span>
      {otherProps.multiple && (
        <span
          className={classNames(classes.footer, {
            [classes.hideSelectAllButton]: otherProps.hideSelectAllButton,
          })}
        >
          {otherProps.hideSelectAllButton ? null : (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={() => {
                otherProps.onItemsSelect(options.map(({ value }) => value));
              }}
            >
              Select all
            </Button>
          )}
          {otherProps.showSelectedItemCount ? (
            <span className="u-text--muted">{`${otherProps.selectedItems.length} of ${options.length} selected`}</span>
          ) : (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={() => {
                otherProps.onItemsSelect([]);
              }}
            >
              Clear
            </Button>
          )}
        </span>
      )}
    </ContextualMenu>
  );
};

export default TableFilter;
