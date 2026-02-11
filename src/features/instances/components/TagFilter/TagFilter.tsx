import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useState } from "react";

const TagFilter: FC<FilterProps> = ({
  options,
  label,
  inline = false,
  onChange,
}) => {
  const [searchText, setSearchText] = useState("");

  const { tags, setPageParams } = usePageParams();

  const filteredOptions = options.filter(({ value }) =>
    value.includes(searchText),
  );

  useSetDynamicFilterValidation(
    "tags",
    filteredOptions.map((opt) => opt.value),
  );

  const handleItemsSelect = (items: string[]) => {
    setPageParams({ tags: items });
    onChange?.();
  };

  return (
    <TableFilter
      type="multiple"
      label={label}
      hasToggleIcon
      hasBadge
      options={filteredOptions}
      onItemsSelect={handleItemsSelect}
      onSearch={(search) => {
        setSearchText(search);
      }}
      selectedItems={tags}
      inline={inline}
    />
  );
};

export default TagFilter;
