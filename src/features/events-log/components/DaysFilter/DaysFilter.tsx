import type { FC } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import { DAYS_FILTER_OPTIONS } from "./constants";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

const DaysFilter: FC = () => {
  const { days, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "days",
    DAYS_FILTER_OPTIONS.map((opt) => opt.value),
  );

  return (
    <TableFilter
      multiple={false}
      label="Days"
      showSelectionOnToggleLabel
      hasToggleIcon
      options={DAYS_FILTER_OPTIONS}
      onItemSelect={(item) => setPageParams({ days: item })}
      selectedItem={days.toString()}
    />
  );
};

export default DaysFilter;
