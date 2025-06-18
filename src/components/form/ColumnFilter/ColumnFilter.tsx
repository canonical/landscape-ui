import type { FC } from "react";
import { Icon } from "@canonical/react-components";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { ColumnFilterOption } from "./types";
import classes from "./ColumnFilter.module.scss";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

interface ColumnFilterProps {
  readonly options: ColumnFilterOption[];
  readonly label: string;
  readonly inline?: boolean;
}

const ColumnFilter: FC<ColumnFilterProps> = ({
  options,
  label,
  inline = false,
}) => {
  const { disabledColumns, setPageParams } = usePageParams();

  const getValues = (disabledValues: string[]) => {
    return options
      .filter(({ value }) => !disabledValues.includes(value))
      .map(({ value }) => value);
  };

  useSetDynamicFilterValidation(
    "disabledColumns",
    options.filter((item) => item.canBeHidden).map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="multiple"
      showSelectedItemCount
      label={
        <>
          <Icon name="settings" />
          <span className={classes.label}>{label}</span>
        </>
      }
      onItemsSelect={(items) => {
        setPageParams({ disabledColumns: getValues(items) });
      }}
      options={options}
      disabledOptions={options.filter(({ canBeHidden }) => !canBeHidden)}
      selectedItems={getValues(disabledColumns)}
      inline={inline}
    />
  );
};

export default ColumnFilter;
