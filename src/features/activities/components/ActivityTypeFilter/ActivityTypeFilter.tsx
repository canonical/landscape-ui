import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import { useState } from "react";

interface ActivityTypeFilterProps {
  readonly options: SelectOption[];
  readonly onItemSelect?: () => void;
}

const ActivityTypeFilter: FC<ActivityTypeFilterProps> = ({
  onItemSelect = () => undefined,
  options,
}) => {
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
      type="single"
      label="Type"
      hasToggleIcon
      hasBadge
      onSearch={(search) => {
        setSearchText(search);
      }}
      options={newOptions}
      onItemSelect={(item) => {
        onItemSelect();
        setPageParams({ type: item });
      }}
      selectedItem={type}
    />
  );
};

export default ActivityTypeFilter;
