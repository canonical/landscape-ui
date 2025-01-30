import type { FC } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";

interface GroupFilterProps {
  readonly options: SelectOption[];
}

const GroupFilter: FC<GroupFilterProps> = ({ options }) => {
  const { groupBy, setPageParams } = usePageParams();

  return (
    <TableFilter
      multiple={false}
      label="Group by"
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => setPageParams({ groupBy: item })}
      selectedItem={groupBy}
    />
  );
};

export default GroupFilter;
