import customClasses from "@/components/filter/TableFilter/components/TableFilterCustom/TableFilterCustom.module.scss";
import multipleClasses from "@/components/filter/TableFilter/components/TableFilterMultiple/TableFilterMultiple.module.scss";
import singleClasses from "@/components/filter/TableFilter/components/TableFilterSingle/TableFilterSingle.module.scss";
import commonClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import type {
  CustomFilterProps,
  MultipleFilterProps,
  SingleFilterProps,
} from "@/components/filter/TableFilter/types";
import SearchBoxWithForm from "@/components/form/SearchBoxWithForm";
import { Button, Input } from "@canonical/react-components";
import classNames from "classnames";
import { Fragment, type ChangeEvent } from "react";

export function renderSingleBody(
  props: SingleFilterProps & { handleCloseMenu?: () => void },
) {
  const {
    options,
    disabledOptions,
    onSearch,
    selectedItem,
    onItemSelect,
    handleCloseMenu,
  } = props;

  return (
    <span
      className={classNames(singleClasses.container, {
        [singleClasses.hasSearch]: Boolean(onSearch),
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
              <span className={singleClasses.selected}>{optLabel}</span>
            ) : (
              <Button
                type="button"
                appearance="base"
                className={singleClasses.button}
                onClick={() => {
                  onItemSelect(value);
                  handleCloseMenu?.();
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
  );
}

export function renderMultipleBody(props: MultipleFilterProps) {
  const {
    options,
    disabledOptions,
    onSearch,
    selectedItems,
    onItemsSelect,
    hideSelectAllButton = false,
    showSelectedItemCount = false,
  } = props;

  return (
    <>
      <span className={multipleClasses.container}>
        {onSearch && <SearchBoxWithForm onSearch={onSearch} />}
        <ul className={commonClasses.list}>
          {options.map((option, i) => {
            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.checked) {
                onItemsSelect([
                  ...selectedItems,
                  option.value,
                  ...(option.options
                    ?.map(({ value }) => value)
                    .filter((value) => !selectedItems.includes(value)) ?? []),
                ]);
              } else {
                onItemsSelect(
                  selectedItems.filter((val) => val !== option.value),
                );
              }
            };

            const disabled = disabledOptions?.some(
              (disabledOption) => disabledOption.value === option.value,
            );

            return (
              <Fragment key={option.value}>
                <li
                  className={classNames(commonClasses.listItem, {
                    [commonClasses.separated]:
                      option.group &&
                      options[i + 1] !== undefined &&
                      options[i + 1].group !== option.group,
                  })}
                >
                  <Input
                    type="checkbox"
                    label={option.label}
                    labelClassName="u-no-padding--top u-no-margin--bottom"
                    value={option.value}
                    checked={selectedItems.includes(option.value)}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </li>
                {option.options?.map((nestedOption) => {
                  const handleNestedChange = (
                    e: ChangeEvent<HTMLInputElement>,
                  ) => {
                    if (e.target.checked) {
                      onItemsSelect([...selectedItems, nestedOption.value]);
                    } else {
                      onItemsSelect(
                        selectedItems.filter(
                          (value) =>
                            value !== nestedOption.value &&
                            value !== option.value,
                        ),
                      );
                    }
                  };

                  const nestedDisabled = disabledOptions?.some(
                    (disabledOption) =>
                      disabledOption.value === nestedOption.value ||
                      disabledOption.value === option.value,
                  );

                  return (
                    <li
                      key={nestedOption.value}
                      className={classNames(commonClasses.nestedListItem)}
                    >
                      <Input
                        type="checkbox"
                        label={nestedOption.label}
                        labelClassName="u-no-padding--top u-no-margin--bottom"
                        value={nestedOption.value}
                        checked={selectedItems.includes(nestedOption.value)}
                        onChange={handleNestedChange}
                        disabled={nestedDisabled}
                      />
                    </li>
                  );
                })}
              </Fragment>
            );
          })}
        </ul>
      </span>
      <span
        className={classNames(multipleClasses.footer, {
          [multipleClasses.hideSelectAllButton]: hideSelectAllButton,
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
    </>
  );
}

export function renderCustomBody(
  props: CustomFilterProps & { handleCloseMenu?: () => void },
) {
  const { customComponent: CustomFilter, handleCloseMenu } = props;

  return (
    <div className={customClasses.container}>
      <CustomFilter closeMenu={handleCloseMenu} />
    </div>
  );
}
