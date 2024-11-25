import { ChangeEvent, FC, ReactNode } from "react";
import {
  Badge,
  Button,
  ContextualMenu,
  Input,
  Position,
} from "@canonical/react-components";
import { SelectOption } from "@/types/SelectOption";
import classes from "./TableFilter.module.scss";
import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import classNames from "classnames";
import { GroupedOption } from "./types";

type TableFilterProps = {
  label: ReactNode;
  options: GroupedOption[];
  disabledOptions?: SelectOption[];
  hasBadge?: boolean;
  hasToggleIcon?: boolean;
  onSearch?: (search: string) => void;
  position?: Position;
} & (
  | {
      multiple: false;
      onItemSelect: (item: string) => void;
      selectedItem: string;
    }
  | {
      multiple: true;
      onItemsSelect: (items: string[]) => void;
      selectedItems: string[];
      showSelectedItemCount?: boolean;
    }
);

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
  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    if (!otherProps.multiple) {
      return;
    }

    otherProps.onItemsSelect(
      otherProps.selectedItems.includes(event.target.value)
        ? otherProps.selectedItems.filter((item) => item !== event.target.value)
        : [...otherProps.selectedItems, event.target.value],
    );
  };

  return (
    <ContextualMenu
      autoAdjust={true}
      toggleAppearance="base"
      toggleLabel={
        <>
          <span>{label}</span>
          {hasBadge && (
            <span
              className={classNames(classes.badgeContainer, {
                [classes.multiple]: otherProps.multiple && options.length > 9,
              })}
            >
              {((otherProps.multiple && otherProps.selectedItems.length > 0) ||
                (!otherProps.multiple && otherProps.selectedItem)) && (
                <Badge
                  value={
                    otherProps.multiple ? otherProps.selectedItems.length : 1
                  }
                  className={classes.badge}
                />
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
          [classes.horizontalPadding]: otherProps.multiple || onSearch,
        })}
      >
        {onSearch && <SearchBoxWithForm onSearch={onSearch} />}
        <ul className={classes.list}>
          {options.map(({ label, value, group }, index) => (
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
                  label={label}
                  labelClassName="u-no-padding--top u-no-margin--bottom"
                  value={value}
                  onChange={handleToggle}
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
                  onClick={() => otherProps.onItemSelect(value)}
                >
                  {label}
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
        <span className={classes.footer}>
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() =>
              otherProps.onItemsSelect(options.map(({ value }) => value))
            }
          >
            Select all
          </Button>
          {otherProps.showSelectedItemCount ? (
            <span className="u-text--muted">{`${otherProps.selectedItems.length} of ${options.length} selected`}</span>
          ) : (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={() => otherProps.onItemsSelect([])}
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
