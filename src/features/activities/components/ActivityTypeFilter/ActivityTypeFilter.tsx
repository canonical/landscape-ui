import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useState } from "react";

interface ActivityTypeFilterProps extends FilterProps {
  readonly selection?: {
    readonly value: string;
    readonly onSelect: (value: string) => void;
  };
}

const ActivityTypeFilter: FC<ActivityTypeFilterProps> = ({
  options,
  label,
  inline = false,
  onChange,
  selection,
}) => {
  const [searchText, setSearchText] = useState("");

  const { setPageParams, type } = usePageParams();

  const newOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  useSetDynamicFilterValidation(
    "type",
    selection || !options.some((option) => option.value)
      ? []
      : options.map((opt) => opt.value),
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
        if (selection) {
          selection.onSelect(item);
        } else {
          setPageParams({ type: item });
        }
        onChange?.();
      }}
      selectedItem={selection?.value ?? type}
    />
  );
};

export default ActivityTypeFilter;
