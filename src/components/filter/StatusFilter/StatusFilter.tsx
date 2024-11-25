import { usePageParams } from "@/hooks/usePageParams";
import { SelectOption } from "@/types/SelectOption";
import { FC } from "react";
import TableFilter from "../TableFilter";

interface StatusFilterProps {
  options: SelectOption[];
}

const StatusFilter: FC<StatusFilterProps> = ({ options }) => {
  const { setPageParams, status } = usePageParams();

  return (
    <TableFilter
      multiple={false}
      label="Status"
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => setPageParams({ status: item })}
      selectedItem={status}
    />
  );
};

export default StatusFilter;
