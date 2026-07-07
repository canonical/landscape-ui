import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useState } from "react";

const ActivityTypeFilter: FC<FilterProps> = ({
  options,
  label,
  inline = false,
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
      label={label}
      inline={inline}
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
