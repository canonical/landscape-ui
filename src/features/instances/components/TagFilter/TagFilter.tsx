import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import { useState } from "react";

interface TagFilterProps {
  readonly options: SelectOption[];
  readonly onItemSelect?: () => void;
}

const TagFilter: FC<TagFilterProps> = ({
  onItemSelect = () => undefined,
  options,
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

  return (
    <TableFilter
      type="multiple"
      label="Tag"
      hasToggleIcon
      hasBadge
      options={filteredOptions}
      onItemsSelect={(items) => {
        onItemSelect();
        setPageParams({ tags: items });
      }}
      onSearch={(search) => {
        setSearchText(search);
      }}
      selectedItems={tags}
    />
  );
};

export default TagFilter;
