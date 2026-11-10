import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import type { FC } from "react";
import { useState } from "react";

interface ActivityTypeFilterProps extends FilterProps {
  readonly type: string;
  readonly onItemSelect: (value: string) => void;
}

const ActivityTypeFilter: FC<ActivityTypeFilterProps> = ({
  options,
  type,
  ...props
}) => {
  const [searchText, setSearchText] = useState("");

  const newOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <TableFilter
      type="single"
      hasToggleIcon
      hasBadge
      onSearch={(search) => {
        setSearchText(search);
      }}
      options={newOptions}
      selectedItem={type}
      {...props}
    />
  );
};

export default ActivityTypeFilter;
