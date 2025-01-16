import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import { SelectOption } from "@/types/SelectOption";
import { FC, useState } from "react";

interface ActivityTypeFilterProps {
  options: SelectOption[];
}

const ActivityTypeFilter: FC<ActivityTypeFilterProps> = ({ options }) => {
  const [searchText, setSearchText] = useState("");

  const { setPageParams, type } = usePageParams();

  const newOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <TableFilter
      multiple={false}
      label="Type"
      hasToggleIcon
      hasBadge
      onSearch={(search) => setSearchText(search)}
      options={newOptions}
      onItemSelect={(item) => setPageParams({ type: item })}
      selectedItem={type}
    />
  );
};

export default ActivityTypeFilter;
