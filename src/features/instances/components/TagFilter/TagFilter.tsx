import { FC, useState } from "react";
import { TableFilter } from "@/components/filter";
import { usePageParams } from "@/hooks/usePageParams";
import { SelectOption } from "@/types/SelectOption";

interface TagFilterProps {
  options: SelectOption[];
}

const TagFilter: FC<TagFilterProps> = ({ options }) => {
  const [searchText, setSearchText] = useState("");

  const { tags, setPageParams } = usePageParams();

  const filteredOptions = options.filter(({ value }) =>
    value.includes(searchText),
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
