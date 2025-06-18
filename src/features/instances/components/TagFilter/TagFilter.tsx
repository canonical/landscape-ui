import type { FC } from "react";
import { useState } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import type { FilterProps } from "@/components/filter/types";

const TagFilter: FC<FilterProps> = ({ options, label, inline = false }) => {
  const [searchText, setSearchText] = useState("");

  const { tags, setPageParams } = usePageParams();

  const filteredOptions = options.filter(({ value }) =>
    value.includes(searchText),
  );

  useSetDynamicFilterValidation(
    "tags",
    filteredOptions.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="multiple"
      label={label}
      hasToggleIcon
      hasBadge
      options={filteredOptions}
      onItemsSelect={(items) => {
        setPageParams({ tags: items });
      }}
      onSearch={(search) => {
        setSearchText(search);
      }}
      selectedItems={tags}
      inline={inline}
    />
  );
};

export default TagFilter;
