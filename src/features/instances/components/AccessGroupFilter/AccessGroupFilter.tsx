import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const AccessGroupFilter: FC<FilterProps<GroupedOption>> = ({
  options,
  label,
  inline = false,
  onChange,
}) => {
  const { accessGroups, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "accessGroups",
    options.map((opt) => opt.value),
  );

  const handleItemsSelect = (items: string[]) => {
    setPageParams({ accessGroups: items });
    onChange?.();
  };

  return (
    <TableFilter
      type="multiple"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemsSelect={handleItemsSelect}
      selectedItems={accessGroups}
      inline={inline}
    />
  );
};

export default AccessGroupFilter;
