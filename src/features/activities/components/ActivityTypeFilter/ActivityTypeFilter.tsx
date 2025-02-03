import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import { useState } from "react";

interface ActivityTypeFilterProps {
  readonly options: SelectOption[];
}

const ActivityTypeFilter: FC<ActivityTypeFilterProps> = ({ options }) => {
  const [searchText, setSearchText] = useState("");

  const { setPageParams, type } = usePageParams();

  const newOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  useSetDynamicFilterValidation(
    "type",
    newOptions.map((opt) => opt.value),
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
