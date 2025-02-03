import type { FC } from "react";
import { useState } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

interface TagFilterProps {
  readonly options: SelectOption[];
}

const TagFilter: FC<TagFilterProps> = ({ options }) => {
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
      multiple
      label="Tag"
      hasToggleIcon
      hasBadge
      options={filteredOptions}
      onItemsSelect={(items) => setPageParams({ tags: items })}
      onSearch={(search) => setSearchText(search)}
      selectedItems={tags}
    />
  );
};

export default TagFilter;
