import type { FC } from "react";
import { useState } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

interface TagFilterProps {
  readonly options: SelectOption[];
  readonly label: string;
  readonly inline?: boolean;
}

const TagFilter: FC<TagFilterProps> = ({ options, label, inline = false }) => {
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
