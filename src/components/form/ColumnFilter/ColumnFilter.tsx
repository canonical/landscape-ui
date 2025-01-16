import { FC } from "react";
import { Icon } from "@canonical/react-components";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import { ColumnFilterOption } from "./types";
import classes from "./ColumnFilter.module.scss";

interface ColumnFilterProps {
  options: ColumnFilterOption[];
}

const ColumnFilter: FC<ColumnFilterProps> = ({ options }) => {
  const { disabledColumns, setPageParams } = usePageParams();

  const getValues = (disabledValues: string[]) => {
    return options
      .filter(({ value }) => !disabledValues.includes(value))
      .map(({ value }) => value);
  };

  return (
    <TableFilter
      multiple
      showSelectedItemCount
      label={
        <>
          <Icon name="settings" />
          <span className={classes.label}>Columns</span>
        </>
      }
      onItemsSelect={(items) =>
        setPageParams({ disabledColumns: getValues(items) })
      }
      options={options}
      disabledOptions={options.filter(({ canBeHidden }) => !canBeHidden)}
      selectedItems={getValues(disabledColumns)}
    />
  );
};

export default ColumnFilter;
