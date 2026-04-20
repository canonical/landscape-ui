import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import { useState } from "react";
import { EXCLUDED_ACTIVITY_TYPE_OPTIONS } from "./constants";

interface ActivityTypeFilterProps {
  readonly options: SelectOption[];
}

const ActivityTypeFilter: FC<ActivityTypeFilterProps> = ({ options }) => {
  const [searchText, setSearchText] = useState("");

  const { setPageParams, type } = usePageParams();

  const newOptions = options.filter(
    (option) =>
      !EXCLUDED_ACTIVITY_TYPE_OPTIONS.includes(option.value) &&
      option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  useSetDynamicFilterValidation(
    "type",
    newOptions.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      label="Type"
      hasToggleIcon
      hasBadge
      onSearch={(search) => {
        setSearchText(search);
      }}
      options={newOptions}
      onItemSelect={(item) => {
        setPageParams({ type: item });
      }}
      selectedItem={type}
    />
  );
};

export default ActivityTypeFilter;
