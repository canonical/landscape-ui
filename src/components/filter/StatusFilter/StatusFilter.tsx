import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import TableFilter from "../TableFilter";
import type { FilterProps } from "@/components/filter/types";

const StatusFilter: FC<FilterProps> = ({ options, label, inline = false }) => {
  const { setPageParams, status } = usePageParams();

  useSetDynamicFilterValidation(
    "status",
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
        setPageParams({ status: item });
      }}
      selectedItem={status}
      inline={inline}
    />
  );
};

export default StatusFilter;
