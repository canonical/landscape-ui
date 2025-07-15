import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import type { FilterProps } from "@/components/filter/types";

const GroupFilter: FC<FilterProps> = ({ options, label, inline = false }) => {
  const { groupBy, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "groupBy",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => {
        setPageParams({ groupBy: item });
      }}
      selectedItem={groupBy}
      inline={inline}
    />
  );
};

export default GroupFilter;
