import type { FC } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import { DAYS_FILTER_OPTIONS } from "./constants";

const DaysFilter: FC = () => {
  const { days, setPageParams } = usePageParams();

  return (
    <TableFilter
      multiple={false}
      label="Days"
      showSelectionOnToggleLabel
      hasToggleIcon
      options={DAYS_FILTER_OPTIONS}
      onItemSelect={(item) => setPageParams({ days: parseInt(item, 10) })}
      selectedItem={days.toString()}
    />
  );
};

export default DaysFilter;
